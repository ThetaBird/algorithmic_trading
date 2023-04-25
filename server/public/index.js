const geminiApiURL = "https://api.gemini.com"
const apiURL = `${window.location.origin}/api`
const activeCharts = {};

const getGeminiSymbols = async () => {
    const {status, data} = await axios.get(`${geminiApiURL}/v1/symbols`)
    if(status == 200) return data;
    return [];
}

const getCandlesticks = async (symbol, timeframe) => {
    const {status, data} = await axios.get(`${apiURL}/v1/${symbol}/${timeframe}`)
    if(status == 200) return data;
    return {};
}

const spamRequests = async (symbol) => {
  const timeframes = ["1m","5m","15m","30m","1hr","6hr","1day"]

  timeframes.forEach(time => axios.get(`${apiURL}/v1/${symbol}/${time}`))
  
}

const defaultXAxis = { 
  crosshair_enabled: true, 
  scale: { 
    type: 'time'
  }, 
  defaultMarker: { 
    label_offset: '0,-7', 
    color: ['#2e75fe', 0.5] 
  }, 
  markers: [ 
    { 
      value: '11/15/2014', 
      label_text: "Sell"
    },

    { 
      value: '11/16/2014', 
      label_text: "Buy"
    },

    { 
      value: '11/17/2014', 
      label_text: "Hold"
    }
  ] 
}

const chartOptions = {
    debug: true,
    type: 'candlestick',
    palette: 'fiveColor18',
    legend: {
      template: '%icon %name',
      position: 'outside top'
    },
    animation: { duration: 400 },
    yAxis: [
      {
        id: 'yMain', 
        formatString: 'c', 
        crosshair_enabled: true, 
        orientation: 'opposite', 
        scale: { range_padding: 0.1 }
      },
    ],
    
    //xAxis: {...defaultXAxis},

    defaultPoint: {
      outline_width: 0,
      altColor: '#ff4734',
      color: '#33ae5b',
      subvalue_line_color: '#555',
      tooltip: tooltip
    },
    xAxis_scale_type: 'time',
    series: [
      {
        name: 'MSFT',
        points: [
          ['11/15/2014', 93.87, 94.91, 93.7, 93.76, 10000],
          ['11/16/2014', 93.91, 94.33, 92.07, 92.45, 11000],
          ['11/17/2014', 93.14, 93.55, 91.52, 91.6, 12000],
          
        ]
      },
    ]
}


const createChart = (name, points, heiken, ha_analyzer) => {
    activeCharts.main = JSC.chart('chartDiv', {
      ...chartOptions,
      series:[
          {name, points},
      ],
      
      xAxis:{
        ...defaultXAxis,
        markers: ha_analyzer.filter(ha => Math.abs(ha[1])).map(ha => (
          {
            value: ha[0],
            label_text: ha[1] == 1 ? "Long" : "Short"
          }
        ))
      }
      
    });

    activeCharts.secondary = JSC.chart('heikenDiv', {
      ...chartOptions,
      series:[
          {name:`${name}_heikenashi`, points: heiken}
      ]
    });
}



  function tooltip(point) {
    var color = point.options('close') > point.options('open') ? 'green' : 'red';
    return (
      'Change: <span style="color:' +
      color +
      '">{%close-%open}({100*(%close-%open)/%open}%)</span><br>Open: %open<br/>High: %high<br/>Low: %low<br/>Close: %close'
    );
  }

let targetSymbol = "btcusd";
let targetTimeblock = "1m";
let targetCandlesticks = [];
let targetHeiken = [];
let targetPercentage = [];
let targetHA_Analyzer = [];


const update = async (updateCandlesticks = false) => {
    if(updateCandlesticks){
      console.log("PULLING CANDLESTICKS")
      target = await getCandlesticks(targetSymbol, targetTimeblock);
      console.log(target)
      targetCandlesticks = target.candlesticks;
      targetHeiken = target.heiken;
      targetHA_Analyzer = target.ha_analyzer;
    }
    if(!targetCandlesticks.length) return;

    console.log("update")
    const old2 = Date.now()
    const candleLen = targetCandlesticks.length;
    const leftTargetSpliceIndx = Math.floor(candleLen - candleLen * targetPercentage[1]/100);
    const rightTargetSpliceIndx = Math.floor(candleLen - candleLen * targetPercentage[0]/100);
    
    const displayCandlesticks = targetCandlesticks.slice(leftTargetSpliceIndx, rightTargetSpliceIndx);
    const displayHeiken = targetHeiken.slice(leftTargetSpliceIndx, rightTargetSpliceIndx);
    const displayHA_Analyzer = targetHA_Analyzer.slice(leftTargetSpliceIndx, rightTargetSpliceIndx);
    console.log({diff2: Date.now() - old2})

    evaluateAnalyzer(displayCandlesticks, displayHA_Analyzer)

    const old = Date.now();
    createChart(targetSymbol, displayCandlesticks, displayHeiken, displayHA_Analyzer)
    return console.log({diff: Date.now() - old})

    if(!activeCharts.main)
      return createChart(targetSymbol, displayCandlesticks, displayHeiken, displayHA_Analyzer)

    updateChart("main", displayCandlesticks)
    updateChart("secondary", displayHeiken)
    
}

const updateChart = (name, points, points2) => {
  const chart = activeCharts[name];
  chart.series(0).options({ points });
}



const init = async () => {
    const symbols = await getGeminiSymbols();
    for(const symbol of symbols){
        $('#symbols').append(`<option value="${symbol}">${symbol}</option>`)
        //console.log(`Spamming ${symbol}`)
        //spamRequests(symbol);
    }

    update();
}



//1m, 5m, 15m, 30m, 1hr, 6hr, 1day

init();

$("#symbols").on("change", function(){
    targetSymbol = this.value;
    update(true)
})

$("#timeblocks").on("change", function(){
    targetTimeblock = this.value;
    update(true)
})

const slider = document.getElementById('slider');

noUiSlider.create(slider, {
    start: [90, 100],
    connect: true,
    behaviour: "drag-smooth-steps",
    step:1,
    range: {
        'min': 0,
        'max': 100
    }
});

slider.noUiSlider.on('update', (values) => {
  targetPercentage = values
  update();
});



const evaluateAnalyzer = (displayCandle, displayAnalyzer) => {
  const deltaTracker = {
    win:[],
    lose:[],
  }

  let numDecisions = 0;
  const firstDecisionIndx = displayAnalyzer.findIndex(decision => decision != 0);
  const decisionLength = displayAnalyzer.length;
  
  let lastPrice = -1;
  let lastDecision = 0;
  let lastDecisionIndx = 0;
  let totalDelta = 1;

  for(let i = firstDecisionIndx; i < decisionLength; i++){
    const newDecision = displayAnalyzer[i][1]
    if(newDecision == 0) continue;

    numDecisions++;
    lastDecisionIndx = i;
    const newPrice = displayCandle[i][4] //close
    

    if(lastPrice == -1){
      lastPrice = newPrice;
      lastDecision = newDecision;
      continue;
    }
    const delta = (newPrice - lastPrice) * lastDecision;
    const delta_hat = delta/lastPrice;

    if(delta_hat < 0) deltaTracker.lose.push(delta_hat)
    else deltaTracker.win.push(delta_hat)

    totalDelta += totalDelta * delta_hat
  }

  console.log(numDecisions);
  console.log(deltaTracker);
  console.log(totalDelta)
  console.log((1 + (displayCandle[lastDecisionIndx][4] - displayCandle[firstDecisionIndx][4])/displayCandle[firstDecisionIndx][4]))
}