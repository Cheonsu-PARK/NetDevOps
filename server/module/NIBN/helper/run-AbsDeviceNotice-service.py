import sys

if sys.argv[2] == '':
    print('ACL,VR,BGP Filter,SYSLOG')
elif sys.argv[2] == 'ACL':
    print('telnet,snmp')
