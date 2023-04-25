import numpy as np
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Decision

def ha_analyzer2(candles):
   
    decisions = np.array([])
    currentDecision = 0


    running = np.array([])

    for (i, candle) in enumerate(candles):
        running = np.append(running, ha_type2(candle))

        if(i < 3):
            continue

        tempDecision = 0
        time = candle.time

        running = np.delete(running, [0])
        long_signal = sum_arr(running) >= 3
        short_signal = sum_arr(running) <= -3
 
        if currentDecision != 1 and long_signal:
            tempDecision = currentDecision = 1 # enter long, leave short
        elif currentDecision != -1 and short_signal:
            tempDecision = currentDecision = -1 # leave long, enter short
            
        # else hold, keep temp @ 0

        decisions = np.append(decisions, Decision([time, tempDecision]))

    return decisions

def ha_type2(candle):
    doji = 20 * abs(candle.open - candle.close) <= candle.high - candle.low
    if doji and candle.open > candle.close: return -1
    elif doji and candle.open <= candle.close: return 1
    elif candle.open > candle.close: return -2
    else: return 2

def sum_arr(arr):
    sum = 0
    for num in arr: sum += num
    return sum
