import sys
import os
import re

def run(keyword, target_list):
    retHostname = ''
    retMatch = ''
    retResult = ''
    vendorflag = ''

    target =  target_list.replace("\n", "")
    targetConf = open(os.getcwd() + '/module/NIBN/archive/' + target, 'r')
    try:
        for targetLine in targetConf.readlines():
            if re.search('set system host-name', targetLine):
                targetLine = targetLine.split(' ')
                retHostname = targetLine[-1].strip('\n') + ','
                vendorflag = ',Juniper'
            elif re.search('hostname', targetLine):
                targetLine = targetLine.split(' ')
                retHostname = targetLine[-1].strip('\n') + ','
                vendorflag = ',Cisco'

            elif re.search(keyword, targetLine):
                retMatch += targetLine

        if retMatch == '':
            retMatch = 'keyword not found.'
        retResult = retHostname + retMatch + vendorflag

        if retHostname == '':
            retResult = target + ',Hostname not found.' + vendorflag

        print(retResult)
        targetConf.close()

    except:
        print('Error,Fail')
        targetConf.close()

keyword = sys.argv[1]
target_list = sys.argv[2]

if 'adc' not in target_list:
  run(keyword, target_list)

