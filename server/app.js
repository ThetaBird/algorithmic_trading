const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const axios = require("axios");
const { getIndicator } = require("./indicator");
const { getAnalyzer } = require("./analyzer");

const PORT = 3031;
const APIURL = "https://api.gemini.com"
const app = express();


const csvPath = path.resolve(__dirname, "csv");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})

const convertSavedCandle = (candle) => {
    return candle.split(",").map((element, indx) => indx ? parseFloat(element) : parseInt(element))
}

app.get("/api/v1/:ticker/:timeframe", async (req, res) => {
    const {ticker, timeframe} = req.params;
    //const {indicator} = req.query
    try{
        
        const filename = `${csvPath}\\${ticker}\\${timeframe}\\candles.csv`;
        console.log(filename)
        const fileExists = fs.existsSync(filename);
        if(!fileExists){
            const candlesticks = await getCandlesticks(ticker, timeframe);
            if(candlesticks.length) fs.outputFile(filename, candlesticks.map(candle => candle.join(",")).join("\n"))
            res.status(200).send(candlesticks);
            return;
        }

        const candlesticks = fs.readFileSync(filename, {encoding:'utf8'}).split("\n").map(candle => convertSavedCandle(candle));
        const heikenData = await getIndicator(ticker, timeframe, "heiken_ashi")
        const stochasticData = await getIndicator(ticker, timeframe, "stochastic")
        
        //const haData = await getAnalyzer(ticker, timeframe, "ha_analyzer2", "heiken_ashi")
        const haData = await getAnalyzer(ticker, timeframe, "st_analyzer2", "stochastic")
        
        const heiken = heikenData.split("\n").map(candle => convertSavedCandle(candle));
        const stochastic = stochasticData.split("\n").map(triple => convertSavedCandle(triple));
        const ha_analyzer = haData.split("\n").map(candle => convertSavedCandle(candle));
        res.status(200).send({candlesticks, heiken, stochastic, ha_analyzer})
    }catch(error){
        console.log(error)
        res.status(400).send(`${ticker}/${timeframe} failed.`)
    }
    
    
})

const getCandlesticks = async (symbol, timeframe) => {
    const {status, data} = await axios.get(`${APIURL}/v2/candles/${symbol}/${timeframe}`)
    if(status == 200) return data;
    return [];
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//getIndicator("btcusd","1m","heiken_ashi")