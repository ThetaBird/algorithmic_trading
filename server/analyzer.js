const {spawn} = require('child_process');
const fs = require("fs-extra");
const path = require("path");
const csvPath = path.resolve(__dirname, "csv");
const analyzerPath = path.resolve(__dirname, "py/analyzers");

const getAnalyzer = async (ticker, timeframe, analyzer) => {
    const filename = `${csvPath}\\${ticker}\\${timeframe}\\${analyzer}.csv`;

    const fileExists = fs.existsSync(filename);
    if(!fileExists) await runAnalyzer(ticker, timeframe, analyzer);

    const analyzerData = fs.readFileSync(filename, {encoding:'utf8'});
    return analyzerData;
}

const runAnalyzer = async (ticker, timeframe, analyzer) => {
    const dirPath = `${csvPath}\\${ticker}\\${timeframe}`;
    const analyzerFilename = `${analyzerPath}\\analyze.py`;

    const pythonProcess = spawn('python',[analyzerFilename, analyzer, dirPath]);

    return new Promise((resolve) => {
        pythonProcess.stdout.on('data', (data) => {
            resolve()
        });
    })
    
}

module.exports = {getAnalyzer}