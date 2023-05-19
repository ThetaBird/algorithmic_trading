# algorithmic_trading
CSE392 Project • Exploring Trading Strategies and Methodologies With An Automated Algorithmic Application

### Directory Structure
```dir
├── Final_Report.pdf                    # PDF outlining completed project details
├── Problem_Statement.pdf               # PDF outlining initial project problem statment
├── README.md                           # You are here
├── Timeline.pdf                        # PDF outlining initial expectation timeline
├── package-lock.json
├── package.json
├── public                              # boilerplate react public files
├── server                              # backend source code directory
│   ├── analyzer.js                     # backend helper file, decides whether or not to generate new decision values
│   ├── app.js                          # backend start point
│   ├── indicator.js                    # backend helper file, decides whether or not to generate new indicator values
│   ├── public                          # old frontend kept as archived, disregard
│   └── py
│       ├── analyzers                   # directory holding python scripts for decision flag generators
│       │   ├── analyze.py              # python called by node.js runtime, decides which analyzer program to run.
│       │   ├── ha_analyzer.py
│       │   ├── ha_analyzer2.py
│       │   ├── st_analyzer.py
│       │   ├── st_analyzer2.py
│       │   └── st_analyzer3.py
│       ├── common.py                   # python module containing common classes and methods imported by most files.
│       └── indicators                  # directory holding python scripts for indicator generation
│           ├── heiken_ashi.py          # heiken ashi candlestick generator file
│           ├── indicator.py            # python called by node.js runtime, decides which indicator program to run.
│           └── stochastic.py           # fast & slow stochastic indicator generator file
└── src                                 # frontend source code directory
    ├── AlgoChart.js                    # component for chart
    ├── Analysis.js                     # analysis subcomponent
    ├── App.js
    ├── App.test.js
    ├── Dashboard.js                    # Main dashboard component calling all charts and analysis
    ├── PageHeader.js                   # (hidden) header with title and name
    ├── index.css                       # rudimentary css rules for frontend
    ├── index.js                        # frontend js file      
    ├── reportWebVitals.js              # boilerplate react file
    ├── setupTests.js                   # boilerplate react file
    └── timeHelper.js                   # helper file containing function to convert millisecond durations into a character description
```

### Setup
```bash
npm install #install node dependencies

#Install python dependencies (python and pip installations are prerequisites)
pip install numpy
pip install path

#Command to initialize server
node server/app # Port outputted

#Command to initialize react application
npm start # Port outputted

```