import os
import sys
import json

translater = dict()
translater['jun'] = dict()
translater['jun']['version'] = '버전'
translater['jun']['system'] = '시스템'
translater['jun']['chassis'] = '장비(샤시)'
translater['jun']['interfaces'] = '인터페이스'
translater['jun']['snmp'] = 'NMS'
translater['jun']['forwarding-options'] = 'L2 스톰 컨트롤'
translater['jun']['policy-options'] = '라우팅 필터'
translater['jun']['firewall'] = 'ACL'
translater['jun']['routing-instances'] = 'VR'
translater['jun']['routing-options'] = '라우팅'
translater['jun']['protocols'] = '라우팅 프로토콜'
translater['jun']['vlans'] = 'VLAN'

keyBlackList = "@,chassis,version,root-authentication,time-zone,authentication-order,scripts,accouting,ddos-protection,class,password,message,accounting,archive,file,lldp,lldp-med,layer2-control,bridge-priority"
valueWhiteList = "name,disable,description,unit,name,family,ethernet-switching,interface-mode,vlan,members,clients,filter,family,inet,term,from,source-address,then,accept,next-hop,routing-options,static,route,router-id,autonomous-system,as-number,qualified-next-hop,metric,vlan-id,l3-interface,protocol,route-filter,address,prefix-length-range,reject,load-balance,per-packet,exact,self,import,export,neighbor,peer-as,group,bgp,ospf,protocols,ieee-802.3ad,ether-options,bundle,restrict"

def travel(confObj):
    ret = ''
    if str(type(confObj)) ==  "<class 'dict'>":
        for entry in confObj.keys():
            if entry in valueWhiteList:
              if 'next-hop' in entry:
                print('  =>', end= " ")
              if entry != 'name' :
                print(entry, end=" ")
              ret = travel(confObj[entry])
    elif str(type(confObj)) ==  "<class 'list'>":
        for entry in confObj:
          ret = travel(entry)
    else:
      if type(confObj) != type(None):
        print(confObj)
      else:
        print('\n')

def run():
  with open('module/NIBN/archive/' + sys.argv[1], 'r') as f:
      json_data = json.load(f)
      ret = ''
      confJson = json_data['configuration']
      try:
        if sys.argv[2] != '' :
          for key in sys.argv[2].strip('\n').split(','):
              confJson = confJson[key]

        for key in confJson.keys():
          if key in keyBlackList:
            continue
          ret += key.strip('\n') + ','
  
        print(ret.strip(','))
      except:
        print('DATA:')
        travel(confJson)

run()
