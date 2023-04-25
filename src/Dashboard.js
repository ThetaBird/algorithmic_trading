
import { useState, useRef, useEffect } from 'react';
import AlgoChart from "./AlgoChart"
import axios from "axios";
import PageHeader from './PageHeader';
import Analysis from './Analysis';
const APIURL = "http://localhost:3031/api/v1";

export default function Dashboard() {
  console.log("Dashboard")
  const [ticker, setTicker] = useState("btcusd");
  const [timeframe, setTimeframe] = useState("1m");
  const [range, setRange] = useState({});
  const [chartData, setChartData] = useState({primary:[], secondary:[], active:[], evaluated:[]});

  const primaryContainerRef = useRef(null)
  const secondaryContainerRef = useRef(null)
  const thirdContainerRef = useRef(null);
  const primaryChartRef = useRef(null)
  const secondaryChartRef = useRef(null)
  const thirdChartRef = useRef(null);
  //const [secondaryChartData, setSecondaryChartData] = useState([]);
  
  let primary, secondary, evaluated;

  const fetchData = async (ticker, timeframe, ) => {
    return axios.get(`${APIURL}/${ticker}/${timeframe}`);
  }

  const evaluateAnalyzer = (primary) => {
    const evaluated = [];
    let lastPrice = null;
    let lastDecision = null;
    
    let primaryCandles = [...primary[0].data];
    const active = primary[0].markers
    
    for(const trade of active){
      const candleIndex = primaryCandles.findIndex(candle => candle.time == trade.time);
      if(candleIndex == -1){}

      primaryCandles = primaryCandles.slice(candleIndex);
      const candle = primaryCandles[0];

      const newPrice = candle.close;

      if(!lastPrice) {
        lastPrice = newPrice; 
        lastDecision = trade.text == "Long" ? 1 : -1;
        continue
      }
  
      const delta = (newPrice - lastPrice) * lastDecision;
      const delta_hat = (delta/lastPrice) * 100;

      evaluated.push({
        time: trade.time,
        position: trade.text,
        delta_hat
      })

      lastPrice = newPrice; 
      lastDecision = trade.text == "Long" ? 1 : -1;

    }
    console.log({evaluated})
    return evaluated;
  }

  useEffect(() => {
    fetchData(ticker, timeframe).then(res => {
      const {candlesticks, heiken, ha_analyzer} = res.data;
      console.log(candlesticks, heiken, ha_analyzer)

      const cData = candlesticks.map(candle => ({
          time: candle[0],
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4]
      })).reverse();


      const hData = heiken.map(candle => ({
        time: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4]
      })).reverse();

      hData.shift()

      
    
      

      const aData = ha_analyzer
        .filter(element => element[1] != 0).reverse()
        .map(element => {
          const val = element[1];
          const long = (val == 1);
          return {
            time: element[0],
            position: long ? "aboveBar" : "belowBar",
            color: long ? '#2196F3' : "#e91e63",
			      shape: long ? 'arrowDown' : "arrowUp",
            text: long ? "Long" : "Short"
          }
        });

      aData.shift()

      primary = [{type:"candle",data:cData,markers:aData},]
      secondary = [{type:"candle",data:hData}]
      evaluated = evaluateAnalyzer(primary);
      
      setChartData({...chartData, primary, secondary, evaluated});

    });

    
  }, [ticker, timeframe])

  const dimensions = {
    width: window.outerWidth * 2/3 - 100,
    height: window.outerHeight/2 - 150
  }

  const displaySecondary = chartData.secondary[0] ? [{type:"candle",data:chartData.secondary[0].data.filter(candle => candle.time >= range.from && candle.time <= range.to)}] : []

  return (
    
    <div id="dashboard-container">
      <PageHeader/>
      <div id="containers">
        <div id = "chart-containers">
          <div id="primary-container">
            <div id="primary-button-container">
              {["1m","5m","15m","30m","1hr","6hr","1day"].map((item,i) => 
                <button className={item == timeframe ? "primary-button primary-button-active" : 'primary-button'} key={i} onClick={() => setTimeframe(item)}>{item.toUpperCase()}</button>
              )}
            </div>

            <div id="primary-chart">
              {!!chartData.primary.length && <AlgoChart setRange={setRange} display={chartData.primary} chartContainerRef={primaryContainerRef} chart={primaryChartRef} activeRange={range} type={"primary"} dimensions={dimensions}/>}
            </div>
              
            
            
          </div>
          <div id="secondary-container">
            {!!chartData.secondary.length && <AlgoChart setRange={setRange} display={displaySecondary} chartContainerRef={secondaryContainerRef} chart={secondaryChartRef} activeRange={range} type={"secondary"} dimensions={dimensions}/>}
          </div>
        </div>
        
        <Analysis setRange={setRange} chartData={chartData} ticker={ticker} timeframe={timeframe} range={range} chartContainerRef={thirdContainerRef} chartRef={thirdChartRef}/>


      </div>
    </div>
    
  )

}