import sys
import os
import shutil

def run():
    confirmedList = os.listdir(os.getcwd() + '/module/NIBN/confirm/')
    allConfigs = ''
    for confirmed in confirmedList:
        f = open(os.getcwd() + '/module/NIBN/confirm/' + confirmed)
        allConfigs += f.read() + ','
        f.close()
    print(allConfigs.strip(','))

run()
