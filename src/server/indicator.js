const {spawn} = require('child_process');
const fs = require("fs-extra");
const path = require("path");
const csvPath = path.resolve(__dirname, "csv");
const indicatorPath = path.resolve(__dirname, "indicators");

const getIndicator = async (ticker, timeframe, indicator) => {
    const filename = `${csvPath}\\${ticker}\\${timeframe}\\${indicator}.csv`;
    console.log(filename)
    const fileExists = fs.existsSync(filename);
    if(!fileExists){
        const data = await runIndicator(ticker, timeframe, indicator);
        console.log({data});
    }

    //const indicatorData = fs.readFileSync(filename, {encoding:'utf8'});
    //return indicatorData;
}

const runIndicator = async (ticker, timeframe, indicator) => {
    const dirPath = `${csvPath}\\${ticker}\\${timeframe}`;
    const indicatorFilename = `${indicatorPath}\\${indicator}.py`;

    const pythonProcess = spawn('python',[indicatorFilename, dirPath]);

    return new Promise((resolve, reject) => {
        console.log("Trying to resolve")
        pythonProcess.stdout.on('data', (data) => {
            resolve(data.toString())
        });
    })
    
}

module.exports = {getIndicator}