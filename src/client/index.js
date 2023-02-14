const apiURL = "https://api.gemini.com"

const getGeminiSymbols = async () => {
    const {status, data} = await axios.get(`${apiURL}/v1/symbols`)
    if(status == 200) return data;
    return [];
}

const getCandlesticks = async (symbol, timeframe) => {
    const {status, data} = await axios.get(`${apiURL}/v2/candles/${symbol}/${timeframe}`)
    if(status == 200) return data;
    return [];
}

const init = async () => {
    const symbols = await getGeminiSymbols();
    console.log(symbols)
}

init();



var chart = JSC.chart('chartDiv', {
    debug: true,
    type: 'candlestick',
    palette: 'fiveColor18',
    legend: {
      template: '%icon %name',
      position: 'inside top left'
    },
    yAxis: {
      formatString: 'c',
      markers: [
        /* The legend entry is unified into only the support marker to represent both support and resistance. */
        {
          value: 102.2,
          color: 'crimson',
          label: { text: 'Resistance', align: 'center' },
          legendEntry_visible: false
        },
        {
          value: 91,
          color: 'crimson',
          label: { text: 'Support', align: 'center' },
          legendEntry_name: 'Support/Resistance'
        }
      ]
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
  });
  function tooltip(point) {
    console.log(point)
    var color = point.options('close') > point.options('open') ? 'green' : 'red';
    return (
      'Change: <span style="color:' +
      color +
      '">{%close-%open}</span><br>Open: %open<br/>High: %high<br/>Low: %low<br/>Close: %close'
    );
  }