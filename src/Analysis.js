import AlgoChart from "./AlgoChart";
import dhm from "./timeHelper";

export default function Analysis(props){
    const {chartData, ticker, timeframe, range, chartContainerRef, chartRef, setRange} = props;

    console.log(chartData)

    let active = [];
    let activeWindow = [];
    let basicPerformance = [];
    let stratPerformance = [];

    const filter = () => {
        if(!chartData.primary[0]) return;
        active = chartData.evaluated.filter(decision => {
            if(!decision) return false;
            return decision.time >= range.from && decision.time <= range.to
        })

        activeWindow = chartData.primary[0].data
        .filter(candle => candle.time >= range.from && candle.time <= range.to)
        .map(candle => ({time: candle.time, value: candle.close}))

    }

    const getPerformance = () => {
        if(!activeWindow[0]) return;
        let oldPrice = activeWindow[0].value;
        
        basicPerformance = activeWindow.map(candle => ({
            time: candle.time,
            value: 100 * candle.value/oldPrice
        }))

        let portfolio = 100;
        let lastDecision = null;
        activeWindow.forEach(candle => {
            const decision = active.find(decision => decision.time == candle.time)

            if(decision){
                if(lastDecision !== null) portfolio = portfolio * (1 + decision.delta_hat/100)
                lastDecision = decision
            }

            stratPerformance.push({
                time: candle.time,
                value: portfolio
            })

            

            
        });
    }

    filter();
    getPerformance();

    console.log({basicPerformance})
    const basicColors = {
        topColor: 'rgba(125, 125, 125, 0.25)',
        bottomColor: 'rgba(125, 125, 125, 0.04)',
        lineColor: 'rgba(125, 125, 125, 0.5)',
    }

    const stratColors = {
        topColor: 'rgba(33, 150, 243, 0.5)',
        bottomColor: 'rgba(33, 150, 243, 0.04)',
        lineColor: 'rgba(33, 150, 243, 1)',
    }

    const performanceReference = {
		price: 100,
		color: '#be1238',
		lineWidth: 2,
		lineStyle: 0,
	}
    const displayWindow = [
        {type:"area",data:basicPerformance, colors: basicColors, line:performanceReference},
        {type:"area",data:stratPerformance, colors: stratColors},
    ]
    const winning = active.filter(trade => trade.delta_hat > 0)
    const winningAvg = winning.map(e => e.delta_hat).reduce((partialSum, a) => partialSum + a, 0) / winning.length
    const losing = active.filter(trade => trade.delta_hat <= 0)
    const losingAvg = losing.map(e => e.delta_hat).reduce((partialSum, a) => partialSum + a, 0) / losing.length

    const winRate = winning.length / active.length;
    const aggregateAvg = winRate * winningAvg + (1-winRate) * losingAvg;

    const dimensions = {
        width: window.outerWidth * 1/3 - 100,
        height: window.outerHeight/3 - 150
    }

    

    return (
        <div id="stat-containers">
          <div id="stat-header">{`${ticker.toUpperCase()} (${timeframe.toUpperCase()}) Analysis`}</div>
          <div className="statSubtitle">ha_analyzer</div>

          <div id="active-timeframe" className='statElement'>
            <div className="statSubHeader">{`Active Window (${dhm(range.to - range.from)})`}</div>
            <div className='statSubtitle2'>{`From: ${new Date(range.from).toString()}`}</div>
            <div className='statSubtitle2'>{`To: ${new Date(range.to).toString()}`}</div>
          </div>

          <div id="active-trade-container" className='statElement'>
            <div className="statSubHeader">{`Active Trades (${active.length})`}</div>
            <div id="trades">
                {active.map((item,i) => 
                    <div key={i} className="statSubtitle2">{`${item.time} | ${item.position} | ${item.delta_hat.toFixed(3)} %`}</div>
                )}
            </div>
          </div>

          <div id="active-trade-summary" className='statElement'>
            <div className="statSubHeader">Summary</div>
            <div className="statSubtitle2">{`${winning.length} Wins of Avg. ${winningAvg.toFixed(5)} %`}</div>
            <div className="statSubtitle2">{`${losing.length} Losses of Avg. ${losingAvg.toFixed(5)} %`}</div>
            <div className="statSubtitle2">{`Aggregate Avg.: ${aggregateAvg.toFixed(5)} %`}</div>

          </div>

          <div id="active-trade-chart" className='statElement'>
            <div ref={chartContainerRef} className="statSubHeader">Strategy Performance</div>
                {!!activeWindow && <AlgoChart setRange={setRange} display={displayWindow} chartContainerRef={chartContainerRef} chart={chartRef} activeRange={range} dimensions={dimensions}/>}
          </div>

        </div>
    )
}

//{!!window.length && <AlgoChart display={displayWindow} chartContainerRef={chartContainerRef} chart={chartRef} activeRange={range}/>}