import os

class BaseConfGenerator:
    def __init__(self, layer, HOSTNAME, OOBIP, FILTERCOND, BANDWIDTHLEVEL):
        self.version = '0.0.0'
        self.A = layer[0]
        self.Z = layer[0] + '_' + layer[1]
        self.T = layer[0] + '_' + layer[1] + '_' + layer[2]
        if layer[3] != '':
            self.S = layer[0] + '_' + layer[1] + '_' + layer[2] + '_' + layer[3]
        else:
            self.S =''
        self.hostname = HOSTNAME
        self.oobip = OOBIP
        self.filterCond = FILTERCOND
        self.bandWidthLevel = BANDWIDTHLEVEL
        self.intmConf = []
        self.baseConf = []

        ipPotions = self.oobip.split('.')
        calcTarget = int(ipPotions[3]) - 1
        ipPotions[3] = str(calcTarget)
        nip = ipPotions[0] + '.' + ipPotions[1] + '.' + ipPotions[2] + '.' + ipPotions[3] 
        self.nexthop = nip

    def midTermGenerate(self, fmt):
        type = fmt[6:7]
        ret = ''
        if type == 'A':
            ret = fmt.replace('{A}', self.A)
        elif type == 'Z':
            ret = fmt.replace('{Z}', self.Z)
        elif type == 'T':
            ret = fmt.replace('{T}', self.T)
        else:
            ret = fmt.replace('{S}', self.S)
        ret = ret.lstrip('$')
        return ret.strip('\n')

    def intermidiateConfGenerate(self):
        baseConf = open(os.getcwd() + '/module/NIBN/nibn/moduleConfigs/base.conf', 'r')
        entryTargetList = []
        entryList = []

        def fillEntry():
            if len(entryTargetList) != 0 and len(entryList) != 0:
                for ip in entryList:
                    for entry in entryTargetList:
                        self.intmConf.append(entry.replace('$ENTRY', ip.strip('\n')).strip('\n'))
                entryTargetList.clear()
                entryList.clear()

        for line in baseConf.readlines():
            if '$REF' in line:
                fillEntry()
                externTarget = self.midTermGenerate(line)
                entryList = open(os.getcwd() + '/module/NIBN/refDatas/networks_baseConf/' + externTarget, 'r').readlines()
                
                print(externTarget.split('_')[1] + ' ' + externTarget.split('_')[2] + ' backend data')
                for entry in entryList:
                    print(entry)
            elif '$ENTRY' in line:
                entryTargetList.append(line.strip('\n'))
            else:
                fillEntry()
                self.intmConf.append(line.strip('\n'))

    def baseConfGenerate(self):
        self.intermidiateConfGenerate()
        print(self.hostname + ' OOB IP :: ' + self.oobip)
        print(self.hostname + ' next-hop IP :: ' + self.nexthop)
        for line in self.intmConf:
            if '$HOST_NAME' in line:
                self.baseConf.append(line.replace('$HOST_NAME', self.hostname))
            elif '$OOB_IP-1' in line:
                self.baseConf.append(line.replace('$OOB_IP-1', self.nexthop))
            elif '$OOB_IP' in line:
                self.baseConf.append(line.replace('$OOB_IP', self.oobip))
            elif '$FILTER_CONDITIONS' in line:
                self.baseConf.append(line.replace('$FILTER_CONDITIONS', self.filterCond))
            elif '$BANDWIDTH_LEVEL' in line:
                ret = line.replace('$BANDWIDTH_LEVEL', self.bandWidthLevel)
                pbndWidLevStr = str(int(int(self.bandWidthLevel) * 2 / 1000))
                self.baseConf.append(ret.replace('$(bandwidth-level * 2 / 1000)', pbndWidLevStr))
            elif '$(bandwidth-level * 2 / 1000)' in line:
                pbndWidLevStr = str(int(int(self.bandWidthLevel) * 2 / 1000))
                self.baseConf.append(line.replace('$(bandwidth-level * 2 / 1000)', pbndWidLevStr))
            else:
                self.baseConf.append(line)

    def setInterfaceConf(self, infNum, confs, arg, infType):
        tmpConfs = []
        confFile = open(self.confFile, 'a')
        for conf in confs:
            if '{N}' in conf:
                tmpConfs.append(conf.replace('{N}', infNum))
        for conf in tmpConfs:
            conf = conf.strip('\n')
            if '$VARIABLE' in conf:
                confFile.write(conf.replace('$VARIABLE', arg + '\n'))
                print(self.hostname + ' interface settings :: ' + conf.replace('$VARIABLE', arg) + ' ----- [100%]')
            else:
                confFile.write(conf + '\n')

        confFile.close()

    def setSpecificConf(self, confs, confArgs):
        confFile = open(self.confFile, 'a')
        confFile.write('\n')
        confLen = len(confs)
        confArgLen = len(confArgs)
        cnt = int(confArgLen / confLen)

        for i in range(0, cnt):
            for j, conf in enumerate(confs):
                conf = conf.strip('\n')
                cmd = 'conf % (' + confArgs[confLen * i + j].strip('\n') + ')'
                confFile.write(eval(cmd))
                confFile.write('\n')
        confFile.close()

    def printConf(self):
        for line in self.baseConf:
            print(line)

    def saveConf(self):
        confFile = open(os.getcwd() + '/module/NIBN/configs/' + self.hostname, 'w')
        for line in self.baseConf:
            confFile.write(line + '\n')
        confFile.close()
        self.confFile = os.getcwd() + '/module/NIBN/configs/' + self.hostname
