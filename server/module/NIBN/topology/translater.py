import os
import json
import ipaddress

class Translater:
    def __init__(self, dsLayerDatas, dsHostNames, dsPortMaps, dsOOBIps, asLayerDatas, asHostNames, asPortMaps, asOOBIps):
        self.version = '0.0.0'
        self.devices = dict()
        portMap = ''
        oobIp = ''
        for idx, hostName in enumerate(dsHostNames):
            self.devices[hostName] = []
            if dsPortMaps[idx] == 'auto':
                portMap = '46-47/50-53/0-45'
            else:
                portMap = dsPortMaps[idx]
            u, i ,s = self.portParse(portMap)
            self.devices[hostName].append(dsLayerDatas[idx])
            self.devices[hostName].append(hostName)
            self.devices[hostName].append(u)
            self.devices[hostName].append(i)
            self.devices[hostName].append(s)
            if dsOOBIps[idx] == 'auto':
                self.devices[hostName].append(self.getNRemove(os.getcwd() + '/module/NIBN/refDatas/networks_oob/' + dsLayerDatas[idx] + '_OOB'))
            else:
                self.devices[hostName].append(dsOOBIps[idx])
        for idx, hostName in enumerate(asHostNames):
            self.devices[hostName] = []
            if asPortMaps[idx] == 'auto':
                portMap = '46-47/50-53/0-45'
            else:
                portMap = asPortMaps[idx]
            u, i ,s = self.portParse(portMap)
            self.devices[hostName].append(asLayerDatas[idx])
            self.devices[hostName].append(hostName)
            self.devices[hostName].append(u)
            self.devices[hostName].append(i)
            self.devices[hostName].append(s)
            if asOOBIps[idx] == 'auto':
                self.devices[hostName].append(self.getNRemove(os.getcwd() + '/module/NIBN/refDatas/networks_oob/' + asLayerDatas[idx] + '_OOB'))
            else:
                self.devices[hostName].append(asOOBIps[idx])
        self.policies = dict()
        self.refer = dict()
        self.refer['TOR_KVM'] = ['Prefix-list [vtep_24exact] 네트워크 대역', 'Prefix-list [public_network] 네트워크 대역', 'EBGP 객체 이름', 'EBGP Next-hop IP,AS번호', 'IBGP 객체 이름', 'IBGP Next-hop IP/AS', '서버 루프백 스태틱 라우팅']

    def getNRemove(self, filename):
        f = open(filename, 'r')
        entry = f.readlines()
        f.close()
        ret = entry[0]
        del entry[0]
        f = open(filename, 'w')
        f.writelines(entry)
        f.close()

        return ret

    def validationCheck(self, dsHostNames, asHostNames):
        for hostName in dsHostNames:
            if len(self.devices[hostName][4]) != len(asHostNames):
                return False
        return True
    
    def portParse(self, portData):
        u = []
        i = []
        s = []

        order = [u, i, s]
        portDataList = portData.split('/')
        for idx, portData in enumerate(portDataList):
            l = order[idx]
            if 'X' in portData:
                continue
            elif '-' in portData:
                ports = portData.split('-')
                for port in range(int(ports[0]), int(ports[1]) + 1):
                    l.append(str(port))
            elif ',' in portData:
                ports = portData.split(',')
                for port in ports:
                    l.append(port)
            else:
                l.append(portData)

        return u, i ,s
    
    def makePolicies(self):
        for key in self.devices.keys():
            policy = dict()
            policy['up-link'] = []
            policy['inter-link'] = []
            policy['service-link'] = []
            policy['filter'] = ''
            policy['bandwidth'] = '1000'
            policy['layer'] = self.devices[key][0]
            policy['properties'] = dict()
            layerChunk = self.devices[key][0].split('_')
            serviceLayer = layerChunk[2]
            if len(layerChunk) == 4:
                serviceLayer += '_' + layerChunk[3]
            if serviceLayer == 'TOR_KVM':
                policy['properties']['vtep-prefix-list'] = ''
                policy['properties']['public-prefix-list'] = ''
                policy['properties']['ebgp-filter'] = ''
                policy['properties']['ebgp-filter-reject'] = ''
                policy['properties']['ibgp-filter-nh-self'] = ''
                policy['properties']['ibgp-filter'] = ''
                policy['properties']['ibgp-filter-reject'] = ''
                policy['properties']['ebgp'] = ''
                policy['properties']['ebgp-neighbor'] = ''
                policy['properties']['ibgp'] = ''
                policy['properties']['ibgp-neighbor'] = ''
                policy['properties']['static-route'] = ''
            policy['hostname'] = self.devices[key][1]
            policy['oobip'] = self.devices[key][5]
            for upLinkPorts in self.devices[key][2]:
                subPolicy = dict()
                subPolicy['type'] = 'L3'
                subPolicy['ifaces'] = upLinkPorts
                subPolicy['target'] = ''
                subPolicy['allocIdx'] = -1
                policy['up-link'].append(subPolicy)
            for interLinkPorts in self.devices[key][3]:
                subPolicy = dict()
                subPolicy['type'] = 'L3'
                subPolicy['ifaces'] = interLinkPorts
                subPolicy['target'] = ''
                subPolicy['allocIdx'] = -1
                policy['inter-link'].append(subPolicy)
            for serviceLinkPorts in self.devices[key][4]:
                subPolicy = dict()
                subPolicy['type'] = 'L3'
                subPolicy['ifaces'] = serviceLinkPorts
                subPolicy['target'] = ''
                subPolicy['allocIdx'] = -1
                policy['service-link'].append(subPolicy)
            self.policies[key] = policy

    def makeArgs(self, dsHostnames, asHostnames, pairNetList):
        for key in self.devices.keys():
            dstPath = os.getcwd() + '/module/NIBN/nibn/args/' + key
            if not os.path.exists(dstPath):
                os.makedirs(dstPath)

        for i, dsHostname in enumerate(dsHostnames):
            for j, asHostname in enumerate(asHostnames):
                key = dsHostname + '-' + asHostname
                useNet = ''
                if pairNetList[key] == 'auto':
                    asLayerChunk = self.devices[asHostname][0].split('_')
                    asLayerPotion = asLayerChunk[0] + '_' + asLayerChunk[1]
                    useNet = self.getNRemove(os.getcwd() + '/module/NIBN/refDatas/networks_serial/' + asLayerPotion + '_SERIAL')
                else:
                    useNet = pairNetList[key]
                    
                pairNet = list(ipaddress.ip_network(useNet.strip('\n')).hosts())
                print(dsHostname + ' <> ' + asHostname + ' 사용 Serial NW 대역')
                print(' ' + useNet)

                if len(pairNet) < 2:
                    return "Network inputs are invalid"
                
                self.policies[dsHostname]['service-link'][j]['allocIdx'] = j
                self.policies[asHostname]['up-link'][i]['allocIdx'] = i

                dsServiceLinkFile = open(os.getcwd() + '/module/NIBN/nibn/args/' + dsHostname + '/service-link.args', 'a')
                dsServiceLinkFile.write(str(pairNet[0]) + '\n')
                print('  ' + dsHostname + ' 사용 IP : ' + str(pairNet[0]))
                asUpLinkFile = open(os.getcwd() + '/module/NIBN/nibn/args/' + asHostname + '/up-link.args', 'a')
                asUpLinkFile.write(str(pairNet[len(pairNet) -  1]) + '\n')
                print('  ' + asHostname + ' 사용 IP : ' + str(pairNet[len(pairNet) - 1]))

                dsServiceLinkFile.close()
                asUpLinkFile.close()

    def makePolicyFiles(self):
        for key in self.devices.keys():
            jsonFmt = json.dumps(self.policies[key], indent=4,ensure_ascii=False)
            file = open(os.getcwd() + '/module/NIBN/nibn/buildPolicies/' + key, 'w', encoding='utf-8')
            file.write(jsonFmt)
            file.close()

    def referInput(self, layer):
        if 'TOR_KVM' in layer:
            return self.refer['TOR_KVM']
        return None
        
    def deliverInput(self, inputDict):
        for host in inputDict.keys():
            serviceInput = inputDict[host]
            print(serviceInput)
            
