import sys
import csv
import numpy as np

# print(sys.argv)

INDICATOR = "heiken_ashi"
csvPath = sys.argv[1]

class Candle:
  def __init__(self, l):
    self.time = l[0]
    self.open = l[1]
    self.high = l[2]
    self.low = l[3]
    self.close = l[4]
    self.volume = l[5]


def init():
   
    candles = np.array([])

    with open(f'{csvPath}\candles.csv', newline='') as csvfile:
        reader = csv.reader(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        for row in reader:
            candles = np.append(candles, Candle(row))
        print(len(candles))

    with open(f'{csvPath}\heiken_ashi.csv', 'w+', newline = '') as csvfile:
        heiken_ashi_candles = heiken_ashi(candles)
        writer = csv.writer(csvfile, quoting = csv.QUOTE_NONNUMERIC)
        for candle in heiken_ashi_candles:
            row = [candle.time, candle.open, candle.high, candle.low, candle.close, candle.volume]
            writer.writerow(row)

    sys.stdout.flush()



def heiken_ashi(candles):
   
    ha_candles = np.array([])

    prevCandle = candles[0]
    for candle in candles[1:] :
        close = np.mean(([candle.open, candle.close, candle.high, candle.low]))
        open = np.average([prevCandle.open, prevCandle.close])
        high = np.max([candle.high, candle.open, candle.close])
        low = np.min([candle.low, candle.open, candle.close])
        ha_candle = Candle([candle.time, open, high, low, close, candle.volume])
        ha_candles = np.append(ha_candles, ha_candle)
        prevCandle = candle

    return ha_candles

init()
