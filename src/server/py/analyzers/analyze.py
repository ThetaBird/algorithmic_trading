import sys
import csv
import numpy as np 
import os

from ha_analyzer import ha_analyzer

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Candle


# print(sys.argv)

ANALYZER = sys.argv[1]
CSVPATH = sys.argv[2]

def getAnalyzer(candles):
    if(ANALYZER == "ha_analyzer"): return ha_analyzer(candles)

def init():
   
    candles = np.array([])

    with open(f'{CSVPATH}\heiken_ashi.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        for row in reader:
            candles = np.append(candles, Candle(row))

    with open(f'{CSVPATH}\{ANALYZER}.csv', 'w+', newline = '') as csvfile:
        analyzerRows = getAnalyzer(candles)
        writer = csv.writer(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        for row in analyzerRows:
            writer.writerow([row])

    sys.stdout.flush()



init()