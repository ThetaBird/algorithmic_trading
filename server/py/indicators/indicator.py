import sys
import csv
import numpy as np 
import os

from heiken_ashi import heiken_ashi
from stochastic import stochastic

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Candle
from common import TimedTuple


# print(sys.argv)

INDICATOR = sys.argv[1]
CSVPATH = sys.argv[2]

def convertCandleToRow(candle):
    return [candle.time, candle.close, candle.high, candle.low, candle.open, candle.volume]

def convertTimedTupleToRow(timedValue):
    return [timedValue.time, timedValue.value1, timedValue.value2]

def combineTupleArrays(one, two):
    final = np.array([[]])
    for (i, e) in enumerate(one):
        #print(e.time)
        #print(e.value)
        #print(two[i].value)
        final = np.append(final, TimedTuple([e.time, e.value, two[i].value]))
    return final

def getIndicator(candles):
    if(INDICATOR == "heiken_ashi"): return map(convertCandleToRow, heiken_ashi(candles))
    elif(INDICATOR == "stochastic"): 
        (fast, slow) = stochastic(candles)
        return map(convertTimedTupleToRow, combineTupleArrays(fast, slow))



def init():
   
    candles = np.array([])

    with open(f'{CSVPATH}\candles.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        for row in reader:
            candles = np.append(candles, Candle(row))
        print(len(candles))

    with open(f'{CSVPATH}\{INDICATOR}.csv', 'w+', newline = '') as csvfile:
        indicatorRows = getIndicator(candles)
        
        writer = csv.writer(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        print(indicatorRows)
        for row in indicatorRows:
            writer.writerow(row)

    sys.stdout.flush()



init()

# python server/py/indicators/indicator.py stochastic C:\Users\Theta\Desktop\CSE392\repo\src\server\csv\btcusd\5m