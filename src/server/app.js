const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const PORT = 8080;
const APIURL = "https://api.gemini.com"
const app = express();


let publicPath = path.resolve(__dirname, "csv");
app.use(express.static(publicPath));

app.get("/api/v1/:ticker/:timeframe", async (req, res) => {
    const {ticker, timeframe} = req.params;
    const filename = `${publicPath}/${ticker}_${timeframe}.csv`;
    console.log(filename)
    const fileExists = fs.existsSync(filename);
    if(!fileExists){
        const candlesticks = await getCandlesticks(ticker, timeframe);
        if(candlesticks.length) fs.writeFile(filename, candlesticks.map(candle => candle.join(",")).join("\n"), () => {})
        res.status(200).send(candlesticks);
        return;
    }

    const candlesticks = fs.readFileSync(filename, {encoding:'utf8'});

    res.status(200).send(candlesticks.split("\n").map(candle => candle.split(",")))
    
})

const getCandlesticks = async (symbol, timeframe) => {
    const {status, data} = await axios.get(`${APIURL}/v2/candles/${symbol}/${timeframe}`)
    if(status == 200) return data;
    return [];
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));