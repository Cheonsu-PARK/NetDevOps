import sys
import os

def run(target, args):
    argList = args.split(',')
    refineArgs = ''
    for arg in argList:
        refineArgs += '\"' + arg + '\"' + ','
    refineArgs.strip(',')
    fmtFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/interface-descriptions.conf', 'r')
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
