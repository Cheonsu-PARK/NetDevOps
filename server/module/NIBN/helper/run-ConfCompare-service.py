import os
import sys

def run(target, refer, keyword):
    retMatch = ''
    retMismatch =''
    targetConf = open(os.getcwd() + '/module/NIBN/archive/' + target, 'r')
    find = False
    for targetLine in targetConf.readlines():
        referConf = open(os.getcwd() + '/module/NIBN/archive/' + refer, 'r')
        for referLine in referConf.readlines():
            if targetLine == referLine:
                retMatch += targetLine
                find = True    
                break

        if not find:
            retMismatch += targetLine
        else:
            find = False
        referConf.close()

    ret = retMatch + ',' + retMismatch 
    print(ret)
    targetConf.close()

target = sys.argv[1]
refer = sys.argv[2]
keyword = sys.argv[3]
run(target, refer, keyword)

