import numpy as np
import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from common import Decision

def st_analyzer2(tuples):
   
    decisions = np.array([])
    currentDecision = 0
    
    for tuple in tuples:
        tempDecision = 0

        time = tuple.time

        long_signal = tuple.value2 <= 20
        short_signal = tuple.value2 >= 80

        if currentDecision != 1 and long_signal:
            tempDecision = currentDecision = 1 # enter long, leave short
        elif currentDecision != -1 and short_signal:
            tempDecision = currentDecision = -1 # leave long, enter short
            
        # else hold, keep temp @ 0

        decisions = np.append(decisions, Decision([time, tempDecision]))

    return decisions
