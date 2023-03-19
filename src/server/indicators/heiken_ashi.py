import sys
import csv

# print(sys.argv)

INDICATOR = "heiken_ashi"
csvPath = sys.argv[1]

toPrint = ""

class Candle:
  def __init__(self, l):
    self.time = l[0]
    self.open = l[1]
    self.high = l[2]
    self.low = l[3]
    self.close = l[4]
    self.volume = l[5]

candles = []

with open(f'{csvPath}\candles.csv', newline='\n') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        candles.append(Candle(row))
        


print(len(candles))
sys.stdout.flush()