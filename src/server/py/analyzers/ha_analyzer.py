import numpy as np
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Decision

def ha_analyzer(candles):
   
    decisions = np.array([])
    currentDecision = 0

    LONG = np.array([0,1,1])
    LONG2 = np.array([1,1,1])

    SHORT = np.array([0,-1,-1])
    SHORT2 = np.array([-1,-1,-1])

    running = np.array([0,0,0])

    for candle in candles[3:]:
        tempDecision = 0

        time = candle.time
        running = np.delete(running, [0])
        running = np.append(running, ha_type(candle))

        long_signal = np.array_equal(running, LONG) or np.array_equal(running, LONG2)
        short_signal = np.array_equal(running, SHORT) or np.array_equal(running, SHORT2)

        if currentDecision != 1 and long_signal:
            tempDecision = currentDecision = 1 # enter long, leave short
        elif currentDecision != -1 and short_signal:
            tempDecision = currentDecision = -1 # leave long, enter short
            
        # else hold, keep temp @ 0

        decisions = np.append(decisions, Decision([time, tempDecision]))

    return decisions

def ha_type(candle):
    doji = 20 * abs(candle.open - candle.close) <= candle.high - candle.low
    if doji: return 0
    if candle.open > candle.close: return -1
    return 1