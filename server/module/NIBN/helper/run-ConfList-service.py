import os
import sys

confList = os.listdir(os.getcwd() + '/module/NIBN/archive/')
ret = ''

for target in confList:
  if target == 'adc':
    continue
  if str(sys.argv[1]) == '':
    ret += target + ','
  elif str(sys.argv[1]).lower() in target:
    ret += target + ','

print(ret.strip(','))
