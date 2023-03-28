import numpy as np

def ha_analyzer(candles):
   
    decisions = np.array([0,0,0])
    currentDecision = 0

    LONG = np.array([0,1,1])
    LONG2 = np.array([1,1,1])

    SHORT = np.array([0,-1,-1])
    SHORT2 = np.array([-1,-1,-1])

    running = np.array([0,0,0])

    for candle in candles[3:]:
        running = np.delete(running, [0])
        running = np.append(running, ha_type(candle))

        long_signal = np.array_equal(running, LONG) or np.array_equal(running, LONG2)
        short_signal = np.array_equal(running, SHORT) or np.array_equal(running, SHORT2)

        if currentDecision != 1 and long_signal:
            currentDecision = 1
            decisions = np.append(decisions, 1) # enter long, leave short
        elif currentDecision != -1 and short_signal:
            currentDecision = -1
            decisions = np.append(decisions, -1) # enter short, leave long
        else: decisions = np.append(decisions, 0) # hold
        
    return decisions

def ha_type(candle):
    doji = 20 * abs(candle.open - candle.close) <= candle.high - candle.low
    if doji: return 0
    if candle.open > candle.close: return -1
    return 1