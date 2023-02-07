# algorithmic_trading
CSE392 Project • Exploring Trading Strategies and Methodologies With An Automated Algorithmic Application

### Directory Structure
```dir
.
├── src                         # full source code directory
│   ├── client                  # backend source code directory
│   │   └── index.js            # backend start point
│   │
│   └── server                  # frontend source code directory
│       └── app.js              # frontend start point (temp file for git purposes) 
│
├── .gitignore
├── package-lock.json 
├── package.json
├── Problem_Statement.pdf       # PDF outlining initial project problem statment                
├── README.md                   # You are here
└── Timeline.pdf                # PDF outlining initial expectation timeline
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
TBD
```