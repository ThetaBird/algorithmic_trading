import sys
import csv
import numpy as np 
import os

from heiken_ashi import heiken_ashi

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Candle


# print(sys.argv)

INDICATOR = sys.argv[1]
CSVPATH = sys.argv[2]

def convertCandleToRow(candle):
    return [candle.time, candle.close, candle.high, candle.low, candle.open, candle.volume]

def getIndicator(candles):
    if(INDICATOR == "heiken_ashi"): return map(convertCandleToRow, heiken_ashi(candles))



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
        for row in indicatorRows:
            writer.writerow(row)

    sys.stdout.flush()



init()