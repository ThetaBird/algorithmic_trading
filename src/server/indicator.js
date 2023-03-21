const {spawn} = require('child_process');
const fs = require("fs-extra");
const path = require("path");
const csvPath = path.resolve(__dirname, "csv");
const indicatorPath = path.resolve(__dirname, "py/indicators");

const getIndicator = async (ticker, timeframe, indicator) => {
    const filename = `${csvPath}\\${ticker}\\${timeframe}\\${indicator}.csv`;

    const fileExists = fs.existsSync(filename);
    if(!fileExists) await runIndicator(ticker, timeframe, indicator);

    const indicatorData = fs.readFileSync(filename, {encoding:'utf8'});
    return indicatorData;
}

const runIndicator = async (ticker, timeframe, indicator) => {
    const dirPath = `${csvPath}\\${ticker}\\${timeframe}`;
    const indicatorFilename = `${indicatorPath}\\indicator.py`;

    const pythonProcess = spawn('python',[indicatorFilename, indicator, dirPath]);

    return new Promise((resolve) => {
        pythonProcess.stdout.on('data', (data) => {
            resolve()
        });
    })
    
}

module.exports = {getIndicator}