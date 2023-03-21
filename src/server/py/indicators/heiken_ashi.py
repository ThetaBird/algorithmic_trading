import numpy as np
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Candle

def heiken_ashi(candles):
   
    ha_candles = np.array([])

    prevCandle = candles[0]
    for candle in candles[1:] :
        close = np.mean(([candle.open, candle.close, candle.high, candle.low]))
        open = np.mean([prevCandle.open, prevCandle.close])
        high = max(candle.high, open, close)
        low = min(candle.low, open, close)
        ha_candle = Candle([candle.time, open, high, low, close, candle.volume])
        ha_candles = np.append(ha_candles, ha_candle)
        prevCandle = candle

    return ha_candles
