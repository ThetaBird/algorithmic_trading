# algorithmic_trading
CSE392 Project • Exploring Trading Strategies and Methodologies With An Automated Algorithmic Application

### Directory Structure
```dir
.
├── src                                 # full source code directory
│   │
│   ├── client                          # frontend source code directory
│   │   ├── index.html                  # frontend html file
│   │   ├── index.js                    # frontend js file
│   │   ├── nouislider.min.css          # css file for lightweight slider for data visualization
│   │   └── nouislider.min.js           # js file for lightweight slider for data visualization
│   │
│   └── server                          # backend source code directory
│       ├── csv                         # directory holding csv files of candlestick & indicator data
│       ├── py
│       │   ├── __pycache__     
│       │   ├── analyzers               # directory holding python scripts for decision flag generators
│       │   │
│       │   ├── indicators              # directory holding python scripts for indicator generation
│       │   │   ├── __pycache__
│       │   │   ├── heiken_ashi.py      # heiken ashi candlestick generator file
│       │   │   └── indicator.py        # python called by node.js runtime, decides which indicator program to run.
│       │   └── common.py               # python module containing common classes and methods imported by most files.
│       │ 
│       ├── app.js                      # backend start point
│       └── indicator.js                # backend helper file, decides whether or not to generate new indicator values by running indicator.py.
│
├── .gitignore
├── package-lock.json 
├── package.json
├── Problem_Statement.pdf               # PDF outlining initial project problem statment                
├── README.md                           # You are here
└── Timeline.pdf                        # PDF outlining initial expectation timeline
```

### Brainstorming Free Data Sources
```
coinapi.io (real-time & historical data for 300+ exchanges) (100 requests/day limit)
coinmarketcap.com (no free historical data) (10,000 requests/month)
> gemini.com (account required, real-time & trade history available, public endpoints available) (600 requests/minute) (websocket available) (perform real and/or sandbox trades)
coingecko.com (no free historical data) (10-50 requests/minute)
polygon.io (historical data, no free real-time data) (5 requests/minute)
```

### Brainstorming Free JS libraries for visualizing data
```
chartjs.org (interactive, nifty little library, and I already have experience with it. However, native financial charts are not supported, but there are workarounds (and open-source examples))
> jscharting.com (Native financial chart support, interactive)
npmjs.com/package/react-financial-charts (already includes built-in indicators, but doesn't support non-financial graphs (might be needed in the future to track stuff like "profits", etc.). Also required React.)
plotly.com (Interactive, and has some financial functionality, but seems unpolished and might be geared more towards industrial applications)
```

### Brainstorming Tech Stack for full-stack visualizer
```
> Backend: Node.js
> Frontend: Vanilla JS or React
```

### Brainstorming Tech Stack for analyzer
```
Quant Researchers implement algorithmic prototypes for trading strategies (usually) in Python or R due to their respective simplicities and well-supported data manipulation libraries.
Quant Developers replicate the researched prototypes in a more computationally strong language, such as C/C++, Rust, or (less commonly) Java.

Because the purpose of this project is to explore trading methodologies, my role aligns more closely with the former. I have experience in both Python and R, but I've known Python for longer and already am familiar with some of the vast number of libraries available for data analysis.
Hence,

> Analyzers: Python

The analyzers will be in the form of a python script; one for each indicator or decision flag generator. The NodeJS runtime will call these python scripts to execute upon request. Each script would obtain all relevant data from the stored .csv files, perform all necessary calculations, and output all relevant results in a new .csv file. The NodeJS runtime will then be able to pull the data from the csv file, send it to the client, which can then display everything in a graph.  
```

### Brainstorming Initial Trading Indicator/Strategy
```
> [Heiken-Ashi](https://www.investopedia.com/trading/heikin-ashi-better-candlestick/)

I have chosen the Heiken-Ashi formula as the first test candidate for the following reasons:
- It is relatively simple
- It works for any market
- It essentially just reduces the noise in the candlesticks, making it easier to identify trends
- There are several trading strategies that use Heiken-Ashi to enforce only a few rules in order to make trading decisions (this will make decision flag implementation simpler in the future)
```

### Brainstorming Initial Decision Flag Analyzer
```
```