import os
import sys

confList = os.listdir(os.getcwd() + '/module/NIBN/archive')
ret = ''
idx = 0
for target in confList:
    if target == 'adc':
        continue

    ret+=target + ','
    idx +=1

print(ret.rstrip(','))
