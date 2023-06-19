import sys
import os

def run(target, args):
    argList = args.split(',')
    ifNum = '\"' + argList[0] + '\"'
    unit = '\"' + argList[1] + '\"'
    desc = '\"' + argList[2] + '\"'
    fmtFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/interface-descriptions-check.conf', 'r')
    fmt = fmtFile.read()
    fmtFile.close()
    checkCmd = eval('fmt % (' + ifNum + ',' + unit + ')').strip('\n')
    confFile = open(os.getcwd() + '/module/NIBN/archive/' + target, 'r').readlines()
    matches = ''
    for conf in confFile:
      if checkCmd in conf:
        matches += conf

    fmtFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/interface-descriptions.conf', 'r')
    fmt = fmtFile.read()
    fmtFile.close()
    applyCmd = eval('fmt % (' + ifNum + ',' + unit + ',' + desc + ')').strip('\n')
    print(applyCmd + ',\n' + matches)

target = sys.argv[1]
args = sys.argv[2]

run(target, args)
