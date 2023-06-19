import sys
import os

def run(target, args):
    argList = args.split(',')
    ifNum = '\"' + argList[0] + '\"'
    mtu = '\"' + argList[1] + '\"'
    unit = '\"' + argList[2] + '\"'
    ipAddr = '\"' + argList[3] + '\"'
    refineArgs = ifNum + ',' + mtu + ',' + ifNum + ',' + unit + ',' + ipAddr
    fmtFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/l3-interface.conf', 'r')
    fmt = fmtFile.read()
    fmtFile.close()
    cmd = 'fmt % (' + refineArgs + ')'
    confFile = open(os.getcwd() + '/module/NIBN/archive/' + target, 'a')
    confFile.write(eval(cmd))
    confFile.write('\n')
    confFile.close()
    print('SUCCESS')

target = sys.argv[1]
args = sys.argv[2]

run(target, args)
