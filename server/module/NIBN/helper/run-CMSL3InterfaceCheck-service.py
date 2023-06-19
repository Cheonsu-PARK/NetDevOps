import sys
import os

def run(target, args):
    errDetected = False
    errRet = ''
    argList = args.split(',')
    ifNum = '\"' + argList[0] + '\"'
    mtu = '\"' + argList[1] + '\"'
    unit = '\"' + argList[2] + '\"'
    ipAddr = '\"' + argList[3] + '\"'
    intMtu = int(argList[1])
    if intMtu != 9216:
      errDetected = True
      errRet = 'mtu :: ' + argList[1]

    refineArgs = ifNum + ',' + ifNum + ',' + unit
    fmtCheckFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/l3-interface-check.conf', 'r')
    fmtCheck = fmtCheckFile.read()
    fmtCheckFile.close()
    cmds = eval('fmtCheck % (' + refineArgs + ')').strip('\n')
    cmdChunk = cmds.split('\n')
    confFile = open(os.getcwd() + '/module/NIBN/archive/' + target, 'r').readlines()
    matches = ''
    for cmd in cmdChunk:
      if cmd == '':
        break
      for conf in confFile:
        if cmd in conf:
          matches += conf

    fmtFile = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/l3-interface.conf', 'r')
    fmt = fmtFile.read()
    fmtFile.close()
    refineArgs = ifNum + ',' + mtu + ',' + ifNum + ',' + unit + ',' + ipAddr
    applyCmd = eval('fmt % (' + refineArgs + ')').strip('\n')
    if errDetected:
      print(applyCmd + ',\n' + matches + ',\n' + errRet + '\nRecommand :: 9216') 
    else :
      print(applyCmd + ',\n' + matches) 

target = sys.argv[1]
args = sys.argv[2]

run(target, args)
