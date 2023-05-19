import numpy as np
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Decision

def st_analyzer3(tuples):
   
    decisions = np.array([])
    currentDecision = 0
    previousValue = tuples[0].value1
    
    for tuple in tuples:
        tempDecision = 0

        time = tuple.time

        long_signal = (tuple.value1 >= 20 and previousValue <= 20) or (tuple.value1 >= 80 and previousValue <= 80)
        short_signal = (tuple.value1 <= 80 and previousValue >= 80) or (tuple.value1 <= 20 and previousValue >= 20)

        if currentDecision != 1 and long_signal:
            tempDecision = currentDecision = 1 # enter long, leave short
        elif currentDecision != -1 and short_signal:
            tempDecision = currentDecision = -1 # leave long, enter short
            
        # else hold, keep temp @ 0

        decisions = np.append(decisions, Decision([time, tempDecision]))

        previousValue = tuple.value1

    return decisions
