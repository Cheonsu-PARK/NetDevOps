import sys
import os

def run(target, args):
    argList = args.split(',')
    staticNW = '\"' + argList[0] + '\"'
    staticNH = '\"' + argList[1] + '\"'
    refineArgs = ''
    fmtFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/static-route-check.conf', 'r')
    fmt = fmtFile.read()
    fmtFile.close()
    checkCmd = eval('fmt % (' + staticNW + ')').strip('\n')
    confFile = open(os.getcwd() + '/module/NIBN/archive/' + target, 'r').readlines()
    matches = ''
    for conf in confFile:
      if checkCmd in conf:
        matches += conf

    fmtFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/static-route.conf', 'r')
    fmt = fmtFile.read()
    fmtFile.close()
    applyCmd = eval('fmt % (' + staticNW + ',' + staticNH + ')').strip('\n')
    print(applyCmd + ',\n' + matches)

target = sys.argv[1]
args = sys.argv[2]

run(target, args)
