import sys
import os
import shutil
import json
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from nibn.generator import BaseConfGenerator
from nibn.linker import Linker
from nibn.refinner import Refinner
from topology.translater import Translater

DSHostnameList = []
DSLinkDataList = []
DSLayerDataList = []
DSOOBIpList = []
ASHostnameList = []
ASLinkDataList = []
ASLayerDataList = []
ASOOBIpList = []
pairNetList = dict()

def run(DS, DSNames, DSLayer, AS, ASNames, ASLayer):
    DSHostnameList = DSNames.split(' ')
    for i, hn in enumerate(DSHostnameList):
        DSHostnameList[i] = hn.strip('\n')

    for i in range(0, int(DS)):
        DSLayerDataList.append(DSLayer)
        DSLinkDataList.append('auto')
        DSOOBIpList.append('auto')

    ASHostnameList = ASNames.split(' ')
    for i, hn in enumerate(ASHostnameList):
        ASHostnameList[i] = hn.strip('\n')

    for i in range(0, int(AS)):
        ASLayerDataList.append(ASLayer)
        ASLinkDataList.append('auto')
        ASOOBIpList.append('auto')

    for i in range(0, int(DS)):
        for j in range(0, int(AS)):
            pairNetList[DSHostnameList[i] + '-' + ASHostnameList[j]] = 'auto'

    parser = Translater(DSLayerDataList, DSHostnameList, DSLinkDataList, DSOOBIpList, \
                    ASLayerDataList, ASHostnameList, ASLinkDataList, ASOOBIpList)

    keepGoing = parser.validationCheck(DSHostnameList, ASHostnameList)
    parser.makePolicies()
    keepGoing = parser.makeArgs(DSHostnameList, ASHostnameList, pairNetList)
    parser.makePolicyFiles()

    targetList = os.listdir(os.getcwd() + '/module/NIBN/nibn/buildPolicies')
    for target in targetList:
        with open(os.getcwd() + '/module/NIBN/nibn/buildPolicies/' + target, 'r', encoding='UTF-8') as f:
            jsonData = json.load(f)
            layer = ['', '', '', '']
            for i, l in enumerate(jsonData['layer'].split('_')):
                layer[i] = l
            confGen = BaseConfGenerator(layer, target, jsonData['oobip'], jsonData['filter'], jsonData['bandwidth'])
            confGen.baseConfGenerate()
            confGen.saveConf()
            linker = Linker(layer, target, confGen)
            linker.setInterfaceConf()
            linker.setSpecific()
            refinner = Refinner(confGen)
            refinner.refine()

DSCnt = sys.argv[1]
DSNames = sys.argv[2]
DSLayer = sys.argv[3]
ASCnt = sys.argv[4]
ASNames = sys.argv[5]
ASLayer = sys.argv[6]

print(DSNames, ASNames)
run(DSCnt, DSNames, DSLayer, ASCnt, ASNames, ASLayer)
confList = os.listdir(os.getcwd() + '/module/NIBN/configs/')
allConfigs = ''
for target in confList:
    if target == 'NEW':
        continue
    f = open(os.getcwd() + '/module/NIBN/configs/' + target, 'r')
    allConfigs += f.read() + ','
    f.close()
    shutil.copyfile(os.getcwd() + '/module/NIBN/configs/' + target, os.getcwd() + '/module/NIBN/archive/' + target)
    os.remove(os.getcwd() + '/module/NIBN/configs/' + target)

print('||')
print(allConfigs.strip(','))

policyListPath = os.getcwd() + '/module/NIBN/nibn/buildPolicies/'
buildPolicyList = os.listdir(policyListPath)
for buildPolicy in buildPolicyList:
    os.remove(policyListPath + buildPolicy)

argDirPath = os.getcwd() + '/module/NIBN/nibn/args/'
argDirList = os.listdir(argDirPath)
for argDir in argDirList:
    shutil.rmtree(argDirPath + argDir, ignore_errors=True)
