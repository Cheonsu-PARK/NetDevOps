import sys
import os
import ipaddress

def run(target, args):
    argList = args.split(',')
    vlan =  argList[0]
    network =  argList[1]
    vrf =  argList[2]
    master_determ = argList[3]
    result = []

    base_config = open('/home1/irteamsu/net-auto/server/module/NIBN/nibn/moduleConfigs/irb-interface.conf').readlines()
    confFile = open('/home1/irteamsu/net-auto/server/module/NIBN/archive/' + target, 'a+')
    if master_determ=='1':
        print("master")
        base_args = open('/home1/irteamsu/net-auto/server/module/NIBN/nibn/args/CMSInterfaceIRB-active.args').readlines()
    else:
        print("standby")
        base_args = open('/home1/irteamsu/net-auto/server/module/NIBN/nibn/args/CMSInterfaceIRB-standby.args').readlines()

    for i in range(0, len(base_config)-1):
        line = base_config[i].strip('\n') + ' %(' + base_args[i].strip('\n') + ')'
        confFile.write(eval(line) + '\n')

target = sys.argv[1]
args = sys.argv[2]

run(target, args)
