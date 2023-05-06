import sys
import csv
import numpy as np 
import os

from ha_analyzer import ha_analyzer
from ha_analyzer2 import ha_analyzer2
from st_analyzer import st_analyzer

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Candle
from common import TimedTuple


# print(sys.argv)

ANALYZER = sys.argv[1]
CSVTARGETPATH = sys.argv[2]
SOURCECSV = sys.argv[3]

def convertDecisionToRow(d):
    return [d.time, d.decision]

def getAnalyzer(values):
    if(ANALYZER == "ha_analyzer"): return map(convertDecisionToRow, ha_analyzer(values))
    if(ANALYZER == "ha_analyzer2"): return map(convertDecisionToRow, ha_analyzer2(values))
    if(ANALYZER == "st_analyzer"): return map(convertDecisionToRow, st_analyzer(values))

def getObject(row):
    if(SOURCECSV == "heiken_ashi"): return Candle(row)
    if(SOURCECSV == "stochastic"): return TimedTuple(row)

def init():
   
    values = np.array([])

    print(f'{CSVTARGETPATH}\{SOURCECSV}.csv')

    with open(f'{CSVTARGETPATH}\{SOURCECSV}.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        for row in reader:
            values = np.append(values, getObject(row))

    with open(f'{CSVTARGETPATH}\{ANALYZER}.csv', 'w+', newline = '') as csvfile:
        analyzerRows = getAnalyzer(values)
        writer = csv.writer(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        for row in analyzerRows:
            writer.writerow(row)

    sys.stdout.flush()



init()

# python server/py/analyzers/analyze.py ha_analyzer C:\Users\Theta\Desktop\CSE392\repo\server\csv\btcusd\5m heiken_ashi
# python server/py/analyzers/analyze.py st_analyzer C:\Users\Theta\Desktop\CSE392\repo\server\csv\btcusd\5m stochastic