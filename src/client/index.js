const geminiApiURL = "https://api.gemini.com"
const apiURL = "http://localhost:8080/api"

const getGeminiSymbols = async () => {
    const {status, data} = await axios.get(`${geminiApiURL}/v1/symbols`)
    if(status == 200) return data;
    return [];
}

const getCandlesticks = async (symbol, timeframe) => {
    const {status, data} = await axios.get(`${apiURL}/v1/${symbol}/${timeframe}`)
    if(status == 200) return data;
    return [];
}



const chartOptions = {
    debug: true,
    type: 'candlestick',
    palette: 'fiveColor18',
    legend: {
      template: '%icon %name',
      position: 'outside top'
    },
    yAxis: {
      formatString: 'c',
    },
    xAxis_crosshair_enabled: true,
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
      }
    ]
}

const createChart = (name, points) => {
    JSC.chart('chartDiv', {
        ...chartOptions,
        series:[
            {name, points}
        ]
    });
}



  function tooltip(point) {
    var color = point.options('close') > point.options('open') ? 'green' : 'red';
    return (
      'Change: <span style="color:' +
      color +
      '">{%close-%open}</span><br>Open: %open<br/>High: %high<br/>Low: %low<br/>Close: %close'
    );
  }

let targetSymbol = "btcusd";
let targetTimeblock = "1day";
let targetCandlesticks = [];
let targetPercentage = [];


const update = async (updateCandlesticks = false) => {
    if(updateCandlesticks) targetCandlesticks = await getCandlesticks(targetSymbol, targetTimeblock);
    if(!targetCandlesticks.length) return;

    

    const candleLen = targetCandlesticks.length;
    const leftTargetSpliceIndx = Math.floor(candleLen - candleLen * targetPercentage[1]/100);
    const rightTargetSpliceIndx = Math.floor(candleLen - candleLen * targetPercentage[0]/100);
    
    const displayCandlesticks = targetCandlesticks.slice(leftTargetSpliceIndx, rightTargetSpliceIndx);
    createChart(targetSymbol, displayCandlesticks)
}



const init = async () => {
    const symbols = await getGeminiSymbols();
    for(const symbol of symbols){
        $('#symbols').append(`<option value="${symbol}">${symbol}</option>`)
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
    start: [70, 100],
    connect: true,
    behaviour: "drag-smooth-steps",
    step:10,
    range: {
        'min': 0,
        'max': 100
    }
});

slider.noUiSlider.on('update', (values) => {
  targetPercentage = values
  update();
});