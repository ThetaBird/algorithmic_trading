class Candle:
  def __init__(self, l):
    self.time = l[0]
    self.open = l[1]
    self.high = l[2]
    self.low = l[3]
    self.close = l[4]
    self.volume = l[5]

class Decision:
  def __init__(self, l):
    self.time = l[0]
    self.decision = l[1]

class TimedValue:
  def __init__(self, l):
    self.time = l[0]
    self.value = l[1]

class TimedTuple:
  def __init__(self, l):
    self.time = l[0]
    self.value1 = l[1]
    self.value2 = l[2]