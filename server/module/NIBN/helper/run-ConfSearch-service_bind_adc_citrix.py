import sys
import os
import re
import json

class bfinder:

    def __init__(self, 
                arrayConf,
                retservice,
                retserviceGroup,
                retbinding,
                bindservice,
                bindserviceGroup,
                bindretbinding):
        
        self.version = "0.0.0"
        self.arrayConf = arrayConf ## full configuration as dictionary value form
        self.retservice = retservice
        self.retserviceGroup = retserviceGroup
        self.retbinding = retbinding
        self.bindservice = bindservice
        self.bindserviceGroup = bindserviceGroup
        self.bindretbinding = bindretbinding

        self.firstkeyofbindretbinding = list(bindretbinding.keys())
        self.firstvalueofbindretbinding = list(bindretbinding.values())

        self.firstkeyofbindserviceGroup = list(bindserviceGroup.keys())
        self.firstvalueofbindserviceGroup = list(bindserviceGroup.values())
        
        self.vservercount = 0

    def binding_vserver(self):
        for key1 in self.firstkeyofbindretbinding:  # Vserver name
             
             for tempMember in self.bindretbinding[key1]["member"]: # tempMember : Service or Service Group Name 
                # print(tempMember)
                if tempMember in self.bindserviceGroup.keys():
                    key2 = self.bindserviceGroup[tempMember]["member"].keys()
                    self.retbinding[key1]["member"].append(self.bindserviceGroup[tempMember]['ServerGroupName'])
                    for key3 in key2:
                        self.retbinding[key1]["member"].append(self.bindserviceGroup[tempMember]["member"][key3]['ServerIP'] + \
                                                               " : " + self.bindserviceGroup[tempMember]["member"][key3]['ServerPort']  )
                elif tempMember in self.retservice:
                    self.retbinding[key1]["member"].append(self.retservice[tempMember]["Server"] + " " + \
                                                           self.retservice[tempMember]["ServerIP"] + \
                                                            " : " + self.retservice[tempMember]["ServerPort"])
                    
        print(json.dumps(self.retbinding))

 

def run(target_list):
    retHostname = ""
    vendorflag = "None"
    arrayConf = []
    bindarrayConf = []

    retservice = dict()
    retserviceGroup = dict()
    retbinding = dict()

    bindservice = dict()
    bindserviceGroup = dict()
    bindretbinding = dict()

    exception_arry = "-policyName |-monitorName "

    index = 0

    addKeyword = "add service |add serviceGroup |add lb vserver |add lb monitor "
    bindKeyword = "bind lb vserver |bind service |bind serviceGroup "
    target =  target_list.replace("\n", "")
    targetConf = open(os.getcwd() + '/module/NIBN/archive/adc/citrix/' + target, 'r')

    for targetLine in targetConf.readlines():
        templine = targetLine.strip("\n"" \n").split(" ")
        if re.search(addKeyword, targetLine):
            arrayConf.append(targetLine.rstrip("\n"))
            if re.search("add service ", targetLine):
                ServerName = templine[2]
                ServerIP = templine[3]
                ServerPort = templine[5]
                retservice[ServerName] = {
                    'Server': ServerName,
                    'ServerIP': ServerIP,
                    'ServerPort': ServerPort
                }
            elif re.search("add serviceGroup ", targetLine):
                ServerGroupName = templine[2]
                retserviceGroup[ServerGroupName] = {
                    'Server': '',
                    'member': []
                }
            elif re.search("add lb vserver ", targetLine):
                index +=1
                VserverName = templine[3]
                VserverVip = templine[5]
                VserverPort = templine[6]
                retbinding[VserverName] = {
                    'id' : index,
                    'VserverName': VserverName,
                    'VserverVip': VserverVip,
                    'VserverPort' : VserverPort,
                    'member' : []
                    'icmp_result' : VserverVip,
                }
        elif re.search(bindKeyword, targetLine):
            templine = targetLine.strip("\n"" \n").split(" ")
            if re.search("bind service ", targetLine):
                ServerName = templine[2]

                if ServerName not in bindservice:
                    bindservice[ServerName] = {
                        'Server': ServerName,
                        'ServerMointor': [templine[4]]
                    }
                else:
                    bindservice[ServerName]['ServerMointor'].append(templine[4])
            elif re.search("bind lb vserver ", targetLine):
                VserverName = templine[3]
                

                if (VserverName not in bindretbinding) and (templine[4] not in exception_arry) :
                    bindretbinding[VserverName] = {
                        'member' : [templine[4]]
                    }
                    
                elif (VserverName in bindretbinding) and (templine[4] not in exception_arry) :
                    bindretbinding[VserverName]['member'].append(templine[4])
                    


            elif re.search("bind serviceGroup ", targetLine):
                ServerGroupName = templine[2]

                if (ServerGroupName not in bindserviceGroup) and (templine[3] not in exception_arry) :
                    bindserviceGroup[ServerGroupName] = {
                        'ServerGroupName': ServerGroupName,
                        'member': {templine[3]: {'ServerIP': templine[3], 'ServerPort': templine[4]}}
                    }
                elif (ServerGroupName in bindserviceGroup) and (templine[3] not in exception_arry) : 
                    bindserviceGroup[ServerGroupName]['member'][templine[3]] = {'ServerIP' : templine[3],'ServerPort' : templine[4]}

    
    run_bfinder = bfinder(arrayConf,
                          retservice,
                          retserviceGroup,
                          retbinding,
                          bindservice,
                          bindserviceGroup,
                          bindretbinding)
    
    run_bfinder.binding_vserver()
    targetConf.close()


def main():
    target_list = sys.argv[1]
    run(target_list)


if __name__ == "__main__":
    main()
