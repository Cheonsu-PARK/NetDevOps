target = ['router-id', 'autonomous-system', 'static route', 'next-hop', 'qualified-next-hop', 'interface', ]
translate = ['라우터 아이디', 'AS 번호', '스태틱 라우팅', '넥스트 홉', '넥스트 홉(후보)', '인터페이스', ]

target = dict()
target['router-id'] = 'Router ID : '
target['autonomous-system'] = 'AS number : '
target['static'] = 'Routing(static) : '
target['route'] = ''
target['qualified-next-hop'] = 'next-hop(secondary)'
target['interface'] = 'interface'
target['peer-as'] = 'Peer AS number : '
target['telnet_access'] = 'Telnet ACL'
target['source-address'] = 'Source address'
target['host'] = 'Host(Server)'

def getTranslator():
    return target
