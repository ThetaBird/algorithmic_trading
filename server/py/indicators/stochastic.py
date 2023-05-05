import numpy as np
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import TimedValue

def stochastic(candles):
    moving_fourteen_low = np.array([])
    moving_fourteen_high = np.array([])
    
    moving_fast_k = np.array([])
    moving_slow_k = np.array([])

    three_moving_k = np.array([0,0,0])

    for (i, candle) in enumerate(candles):
        low = candle.low
        high = candle.high
        moving_fourteen_high = np.append(moving_fourteen_high, high)
        moving_fourteen_low = np.append(moving_fourteen_low, low)

        if(i < 14): continue

        moving_fourteen_high = np.delete(moving_fourteen_high, [0])
        moving_fourteen_low = np.delete(moving_fourteen_low, [0])

        C = candle.close
        L14 = min(moving_fourteen_low)
        H14 = max(moving_fourteen_high)
        K = (C-L14)/(H14-L14) * 100

        moving_fast_k = np.append(moving_fast_k, TimedValue([candle.time, K]))

        three_moving_k = np.append(three_moving_k, K)
        three_moving_k = np.delete(three_moving_k, [0])

        SLOWK = np.mean(three_moving_k)
        moving_slow_k = np.append(moving_slow_k, TimedValue([candle.time, SLOWK]))

    return (moving_fast_k, moving_slow_k)
