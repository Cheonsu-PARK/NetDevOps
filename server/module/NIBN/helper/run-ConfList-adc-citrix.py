import os
import sys

confList = os.listdir(os.getcwd() + '/module/NIBN/archive/adc/citrix')
ret = ''
idx = 0
for target in confList:
    ret+=target + ','
    idx +=1

print(ret.rstrip(','))
