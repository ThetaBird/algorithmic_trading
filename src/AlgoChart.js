import { createChart } from 'lightweight-charts';
import { useRef, useEffect } from 'react';

const algoChart = (chartContainerRef, type, dimensions) => {
    const {width, height} = dimensions;

    const disableInteraction = type=="primary" ? {} : {
        handleScroll: {
            mouseWheel: false,
            pressedMouseMove: false,
            horzTouchDrag: false,
            vertTouchDrag: false
          },
          handleScale: {
              axisPressedMouseMove: false,
              mouseWheel: false,
              pinch: false,
          }
    }
    chartContainerRef.current.innerHTML = '';
    return createChart(chartContainerRef.current, {
      width,//: window.outerWidth * 2/3 - 100,
      height,//: window.outerHeight/2 - 150,
      layout: {
        background: {
          type: 'solid',
          color: 'rgba(0,0,0,0)',
        },
        lineColor: '#242428',
        textColor: '#D9D9D9',
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0)',
      },
      crosshair: {
        color: '#758696',
      },
      grid: {
        vertLines: {
          color: '#323232',
        },
        horzLines: {
          color: '#323232',
        },
      },
      priceScale: {
        borderColor: '#485c7b',
      },
      timeScale: {
        borderColor: '#485c7b',
      },
      
      ...disableInteraction
    });
  }
  
  const addCandlesticks = (chart) => {
    return chart.current.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });
  }

  const addArea = (chart, colors, priceScaleId) => {
    if(priceScaleId) chart.current.applyOptions({
      rightPriceScale: {
          visible: true,
      },
      leftPriceScale: {
          visible: true,
      },
    });
    const p = priceScaleId ? {priceScaleId} : {}
    return chart.current.addAreaSeries({
        ...p,
        ...colors,
        lineWidth: 2,
      });
  }
  
  export default function AlgoChart(props){
    const {setRange, display, activeRange, chart, chartContainerRef, type, dimensions} = props;
    
  
    console.log("AlgoChart")
  
    console.log({display})


    const useEffectParams = [display];
    //if(type == "secondary") useEffectParams.push(activeRange)
    useEffect(() => {
      chart.current = algoChart(chartContainerRef, type, dimensions)
  
      console.log(chart.current);
  
      for(const d of display){
        const {type, data, markers, colors, lines, priceScaleId} = d;
        console.log({d})
        switch(type){
            case "candle":
                const candleSeries = addCandlesticks(chart);
                candleSeries.setData(data);
                if(markers) candleSeries.setMarkers(markers);
                break;
            
            case "area":
                const areaSeries = addArea(chart, colors, priceScaleId);
                areaSeries.setData(data)
                if(lines) lines.forEach(line => areaSeries.createPriceLine(line));
                break;
        }
      }
  
      
   
      if(type=="primary") {
        chart.current.timeScale().subscribeVisibleTimeRangeChange((newRange) => {
            setRange(newRange)
        })
      }

      chart.current.timeScale().fitContent();

      //if(Object.keys(activeRange).length) chart.current.timeScale().setVisibleRange(activeRange)

  
    }, useEffectParams);
  
    console.log({activeRange})
    //if(Object.keys(activeRange).length) chart.current.timeScale().setVisibleRange(activeRange)
  
    return (
      <div className = "chartContainer" ref={chartContainerRef}/>
    )
  }