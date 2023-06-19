import os
import json

class Linker:
    def __init__(self, layer, HOSTNAME, dev):
        self.version = '0.0.0'
        if layer[3] != '':
            self.service = layer[2] + "_" + layer[3]
        else:
            self.service = layer[2]
        self.hostname = HOSTNAME
        with open(os.getcwd() + '/module/NIBN/nibn/buildPolicies/' + self.hostname, 'r', encoding='UTF-8') as f:
            jsonData = json.load(f)
        self.policies = jsonData
        uplinkList = jsonData['up-link']
        interlinkList = jsonData['inter-link']
        servicelinkList = jsonData['service-link']
        self.uplinkList = []
        self.interlinkList = []
        self.servicelinkList = []
        for i in range(0, len(uplinkList)):
            self.uplinkList.append(jsonData['up-link'][i]['ifaces'])
        for i in range(0, len(interlinkList)):
            self.interlinkList.append(jsonData['inter-link'][i]['ifaces'])
        for i in range(0, len(servicelinkList)):
            self.servicelinkList.append(jsonData['service-link'][i]['ifaces'])

        self.properties = jsonData['properties']
        self.dev = dev

    def getArgs(self, type, concat):
        fileName = os.getcwd() + '/module/NIBN/nibn/args/' + self.hostname + '/'
        if concat:
            fileName += type + '.args'
        else:
            fileName += type + '.args'

        args = ''
        try:
            argsFile = open(fileName, 'r')
            args = argsFile.readlines()
            argsFile.close()
        except:
            args = None

        return args

    def getConfs(self, confName, concat):
        fileName = os.getcwd() + '/module/NIBN/nibn/moduleConfigs/'
        if concat:
            fileName += self.service + '_' + confName + '.conf'
        else:
            if 'prefix-list' in confName:
                confName = 'prefix-list'
            fileName += confName + '.conf'
        
        confsFile = open(fileName, 'r')
        confLines = confsFile.readlines()
        confsFile.close()
        return confLines

    def setInterfaceConf(self):
        for infType in self.getInterfacesData():
            if infType == 'properties':
                break
            if infType == 'up-link':
                infsList = self.uplinkList
            if infType == 'service-link':
                infsList = self.servicelinkList
            if infType == 'inter-link':
                infsList = self.interlinkList

            if len(infsList) == 0:
                continue
             
            infConfs = self.getConfs(infType, True)
            confArgs = self.getArgs(infType, True)

            for i, infs in enumerate(infsList):
                if confArgs != None and i < len(confArgs):
                    self.dev.setInterfaceConf(infs, infConfs, confArgs[i].strip('\n') + '/30', infType)
#else:
#self.dev.setInterfaceConf(infs, infConfs, '', infType)

    def setSpecific(self):
        for detail in self.getDetails():
            confs = self.getConfs(detail, False)
            confArgs = self.getArgs(detail, False)
            self.dev.setSpecificConf(confs, confArgs)

    def getUplinkList(self):
        return self.uplinkList

    def getInterfacesData(self):
        keys = [key for key in self.policies]
        keys.remove('hostname')
        keys.remove('layer')
        keys.remove('oobip')
        keys.remove('filter')
        keys.remove('bandwidth')
        return keys

    def getDetails(self):
        return [key for key in self.properties]

    def linkDataParse(self, portList):
        ret = []
        for port in portList:
            ret.append(port)
        return ret

    def linking(self):
        print('Do link')
