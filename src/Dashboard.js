
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
      const {candlesticks, heiken, stochastic, ha_analyzer} = res.data;
      console.log({stochastic})

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
      }))//.reverse();

      //hData.shift()

      const sData1 = stochastic.map(triple => ({
        time: triple[0],
        value: triple[1]
      })).filter(s => s.value != null)//.reverse();

      const sData2 = stochastic.map(triple => ({
        time: triple[0],
        value: triple[2]
      })).filter(s => s.value != null)//.reverse();
    
      

      const aData = ha_analyzer
        .filter(element => element[1] != 0)//.reverse()
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

      aData.pop()

      

      primary = [{type:"candle",data:cData,markers:aData},]
      secondary = [{type:"candle",data:hData}, {type:"area", data:sData1}, {type:"area", data:sData2}]
      evaluated = evaluateAnalyzer(primary);
      
      setChartData({...chartData, primary, secondary, evaluated});

    });

    
  }, [ticker, timeframe])

  const dimensions = {
    width: window.outerWidth * 2/3 - 100,
    height: window.outerHeight/2 - 150
  }

  const sColors = {
    topColor: 'rgba(152, 92, 255, 0)',
    bottomColor: 'rgba(152, 92, 255, 0)',
    lineColor: 'rgba(152, 92, 255, 1)',
  }
  const s2Colors = {
    topColor: 'rgba(164, 135, 171, 0)',
    bottomColor: 'rgba(164, 135, 171, 0)',
    lineColor: 'rgba(164, 135, 171, 1)',
  }
  const sTopLine = {
		price: 80,
		color: '#ce5cff',
		lineWidth: 2,
		lineStyle: 0,
	}
  const sBottomLine = {
		price: 20,
		color: '#ce5cff',
		lineWidth: 2,
		lineStyle: 0,
	}

  const displaySecondary = chartData.secondary[0] ? [{type:"candle",data:chartData.secondary[0].data.filter(candle => candle.time >= range.from && candle.time <= range.to)}] : []
  const displayStochastic = chartData.secondary[1] ? [{type:"area",data:chartData.secondary[1].data.filter(candle => candle.time >= range.from && candle.time <= range.to), colors:sColors, priceScaleId: 'left', lines:[sTopLine, sBottomLine]}] : []
  const displayLongStochastic = chartData.secondary[2] ? [{type:"area",data:chartData.secondary[2].data.filter(candle => candle.time >= range.from && candle.time <= range.to), colors:s2Colors, priceScaleId: 'left'}] : []
  console.log({displayStochastic})
  
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
            {!!chartData.secondary.length && <AlgoChart setRange={setRange} display={[...displaySecondary, ...displayStochastic, ...displayLongStochastic]} chartContainerRef={secondaryContainerRef} chart={secondaryChartRef} activeRange={range} type={"secondary"} dimensions={dimensions}/>}
          </div>
        </div>
        
        <Analysis setRange={setRange} chartData={chartData} ticker={ticker} timeframe={timeframe} range={range} chartContainerRef={thirdContainerRef} chartRef={thirdChartRef}/>


      </div>
    </div>
    
  )

}