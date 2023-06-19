import sys
import os
import ipaddress
import re

def run(target, args):
    errDetected = False
    errRet = ''
    argList = args.split(',')
    vlan =  argList[0]
    network =  argList[1]
    vrf =  argList[2]
    master_determ = argList[3]
    applyCmd = ''
    if int(vlan) > 4096 or int(vlan) <= 0:
      errDetected = True
      errRet = 'vlan :: ' + argList[1]


    base_config = open('/home1/irteamsu/net-auto/server/module/NIBN/nibn/moduleConfigs/irb-interface.conf').readlines()
    confFile = open('/home1/irteamsu/net-auto/server/module/NIBN/archive/' + target, 'r')
    conf = confFile.read()
    confFile.close()
    matches = ''

    if master_determ=='1':
        base_args = open('/home1/irteamsu/net-auto/server/module/NIBN/nibn/args/CMSInterfaceIRB-active.args').readlines()
    else:
        base_args = open('/home1/irteamsu/net-auto/server/module/NIBN/nibn/args/CMSInterfaceIRB-standby.args').readlines()

    for i in range(0, len(base_config)-1):
        line = eval(base_config[i].strip('\n') + ' %(' + base_args[i].strip('\n') + ')')
        applyCmd += eval(base_config[i].strip('\n') + ' %(' + base_args[i].strip('\n') + ')') + '\n'
        
        if re.search(str(line), conf):
           print(str(line))
           matches += line
        elif line == " ":
            break 
    if errDetected:
    	print(applyCmd + ',\n' + matches + ',\n' + errRet + '\n미치셨습니까 휴먼?')
    else : 
        print(applyCmd + ',\n' + matches)
    


target = sys.argv[1]
args = sys.argv[2]

run(target, args)
