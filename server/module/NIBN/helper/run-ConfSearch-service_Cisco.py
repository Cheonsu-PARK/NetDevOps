import sys
import os
import re

def run(keyword, target_list):
    retHostname = ''
    retMatch = ''
    retResult = ''
    vendorflag = 'None'
    ParentLine = ''
    ChildrenLine = ''
    Matchflag = 0

    target =  target_list.replace("\n", "")
    targetConf = open(os.getcwd() + '/module/NIBN/archive/' + target, 'r')
    try:
        for targetLine in targetConf.readlines():
            if targetLine[0] == ' ': ## chidren configuration line search 
                ChildrenLine += targetLine
                if Matchflag == 1 :
                    retMatch +=targetLine
                elif re.search(keyword, targetLine) and Matchflag == 0:
                     Matchflag = 1
                     retMatch += ParentLine 
                     retMatch += ChildrenLine ; ChildrenLine = ''
                     

            elif targetLine[0] != ' ': ## parent configuration line search
                ParentLine = targetLine ; ChildrenLine = '' ; Matchflag = 0
                if re.search('hostname', targetLine):
                    targetLine = targetLine.split(' ')
                    retHostname = targetLine[-1].strip('\n') + ','
                    vendorflag = ',Cisco'
                    ParentLine = ''
           
                elif re.search(keyword, targetLine):
                    retMatch += targetLine
                    Matchflag = 1


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
