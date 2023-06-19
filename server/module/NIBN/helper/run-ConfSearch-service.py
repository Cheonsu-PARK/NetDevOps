import sys
import os
import re

def run(keyword, target_list):
    retHostname = ''
    retMatch = ''
    retResult = ''
     
    target =  target_list.replace("\n", "")
    targetConf = open('/home1/irteamsu/net-auto/server/module/NIBN/archive/' + target, 'r')
    try:
        for targetLine in targetConf.readlines():
            if re.search('set system host-name', targetLine):
                targetLine = targetLine.split(' ')
                retHostname = targetLine[-1].strip('\n') + ',' 
            elif re.search(keyword, targetLine):
                retMatch += targetLine
        if retMatch == '':
          retMatch = 'keyword not found.'
        retResult = retHostname + retMatch 
    
        if retHostname == '':
            retResult = target + ',Hostname not found.'

        print(retResult.strip("||"))
        targetConf.close()
    except:
        print('Error,Fail')
        targetConf.close()

keyword = sys.argv[1]
target_list = sys.argv[2]

if 'adc' not in target_list:
  run(keyword, target_list)
