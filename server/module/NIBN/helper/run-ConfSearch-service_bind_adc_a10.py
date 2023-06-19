import sys
import os
import re
import json

class bfinder:

    def __init__(self, dictionConf):
        self.version = "0.0.0"
        self.dictionConf = dictionConf ## full configuration as dictionary value form
        self.VserverlineConfig = dict() ## temporary save for Vserver Configuration
        self.GrouplineConfig = dict() ## temporary save for service-group Configuration
        self.ServerlineConfig = dict()
        self.Partition = 'Shared'
        
        self.retserver = dict()  ## result server 
        self.retserviceGroup = dict()  ## result service
        self.retbinding = dict() ## result retbinding

        self.index = 0
        self.vservercount = 0

    def binding_vserver(self):
        for key in self.dictionConf:
            if re.search("active-partition", key):
                keytemp = key.strip(" \n""\n").split(" ")
                self.Partition = keytemp[-1]
                #print(self.Partition)

            elif re.search("slb server", key):
                keytemp = key.strip(" \n""\n").split(" ")
                self.ServerlineConfig = self.dictionConf[key]
                ServerName = str(keytemp[-2])
                ServerIP = str(keytemp[-1])

                temp_value = self.line_server_port(ServerName)

                self.retserver[ServerName]= {
                        "Server" : ServerName,
                        "ServerIP" : ServerIP,
                        "ServerPort" : temp_value['ServerPort'],
                        "ServerHealthCheck" : temp_value['ServerHealthCheck']
                        }

                temp_value = self.line_server_port(ServerName)

            elif re.search("slb service-group", key):
                keytemp = key.strip(" \n""\n").split(" ")
                self.GrouplineConfig = self.dictionConf[key]
                temp_value = self.line_group_member_port()
                GroupName = str(keytemp[-2])

                self.retserviceGroup[GroupName] = {}
                self.retserviceGroup[GroupName].update(temp_value)

            elif re.search("slb virtual-server", key):
                keytemp = key.strip(" \n""\n").split(" ")
                self.VserverlineConfig = self.dictionConf[key]
                temp_value = self.line_service_group_name_port()

                VserverName = str(keytemp[-2])
                VserverVip = str(keytemp[-1])
                self.retbinding[self.index] = {}
                self.vservercount = 0
                # print(self.vservercount)
                
                for arr in temp_value:
                    # print(temp_value)
                    self.retbinding[self.index] = {
                        "id" : self.index,
                        "Active-Partion" : self.Partition,
                        "VserverName" : VserverName,
                        "VserverVip" : VserverVip,
                        "VserverPort" : "",
                        "service-group" : "",
                        "member" : []
                        "icmp" : VserverVip,
                        }
                    
                    
                    for key in arr:
                        self.retbinding[self.index][list(key.keys())[0]] = list(key.values())[0]
                        # print(self.retbinding)
                    self.binding_service_group(VserverName)
                    self.index +=1
                    self.vservercount +=1
                    # print(self.index)
                    # print(self.vservercount)
                        
                
        
        #print(self.retserver)
        print(json.dumps(self.retbinding))

    def binding_service_group(self, VserverName):
        GroupName=self.retbinding[self.index]["service-group"]
        # print(self.retserviceGroup[GroupName]["member"])
        try:
            self.retbinding[self.index]["member"] = self.retserviceGroup[GroupName]["member"]
        except : 
            self.retbinding[self.index]["member"] = ["NO-BINDING"]

    def line_group_member_port(self):  
        tempArrayConfig = self.GrouplineConfig.split("\n")
        temp_Groupconfig = dict()
        temp_Groupconfig["member"] = []

        for i in tempArrayConfig:
            i = i.rstrip().strip(" \n").split(" ")
            if i[0] == "member":
                temp_Groupconfig["member"].append( str(i[-2]) + " " + str(self.retserver[str(i[-2])]['ServerIP']) + ":" +str(i[-1])+"\n")

        if temp_Groupconfig["member"] == []:
            temp_Groupconfig["member"].append("No-Binding-Server")

        # print(temp_Groupconfig)
        return temp_Groupconfig

    def line_service_group_name_port(self):
        tempArrayConfig = self.VserverlineConfig.split("\n")
        temp_Vserverconfig = []
        count = 0
        
        for i in tempArrayConfig:
            i = i.rstrip().strip(" \n").split(" ")
            if i[0] == "port":
                temp_Vserverconfig.append([{"VserverPort" : str(i[-2])}])
                # print(temp_Vserverconfig)
            elif i[0] == "service-group" :
                temp_Vserverconfig[count].append({"service-group" : str(i[-1])})
                count+=1
        
        if temp_Vserverconfig == []:
            temp_Vserverconfig = [[{"VserverPort" :""}, {"service-group" : ""}]]
            
        return temp_Vserverconfig
    
    def line_server_port(self, ServerName):
        tempArrayConfig = self.ServerlineConfig.strip(" ").split("\n")
        temp_Serverconfig = {}
        temp_Serverconfig['ServerPort'] = []
        temp_Serverconfig['ServerHealthCheck'] = []

        for i in tempArrayConfig:
            value = i.strip(" ").split(" ")
            if value[0]=="port":
                temp_Serverconfig['ServerPort'].append(value[1])
            elif re.search("health", value[0]):
                temp_Serverconfig["ServerHealthCheck"].append(value[0])

        #print(temp_Serverconfig)
        return temp_Serverconfig
            

def run(target_list):
    retHostname = ""
    vendorflag = "None"
    ParentLine = ""
    ChildrenLine = ""
    dictionConf = dict()

    target =  target_list.replace("\n", "")
    targetConf = open(os.getcwd() + '/module/NIBN/archive/adc/a10/' + target, 'r')

    for targetLine in targetConf.readlines():
        if targetLine[0] != " ": ## Parent configuration line search
            ParentLine = targetLine
            ChildrenLine = ""
            dictionConf[ParentLine] = ""
        elif targetLine[0] == " ": ## Children configuration line search
            ChildrenLine += targetLine
            dictionConf[ParentLine] = ChildrenLine

    run_bfinder = bfinder(dictionConf)
    run_bfinder.binding_vserver()

    targetConf.close()


def main():
    target_list = sys.argv[1]
    run(target_list)


if __name__ == "__main__":
    main()



