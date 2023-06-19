import os

class JuniperCmd:
    def __init__(self):
        self.version="0.0.0"
        self.cmdDict = dict()
        self.makeCmdDict()
        
    def makeCmdDict(self):
        cmdList = ['set', 'version', 'system', 'host-name', 'time-zone', 'ntp', 'services', 'Asia/Seoul', 'boot-server', 'server', 'authentication-order', 'tacplus', 
        'root-authentication', 'encrypted-password', 'tacplus-server', 'secret', 'timeout', 'single-connection', 'source-address', 'accounting', 'events', 'login',
        'interactive-commands', 'destination', 'login', 'class', 'superuser-local', 'user', 'idle-timeout', 'permissions', 'all', 'uid', 'authentication', 'full-name',
        'Authenticated', 'password', 'format', 'sha256', 'message', 'syslog', 'match', 'host', 'any', 'info', 'authorization', 'explicit-priority', 'file', 'messages',
        'archive', 'size', 'files', 'world-readable', 'arp', 'aging-timer', 'ddos-protection', 'protocols', 'aggregate', 'bandwidth', 'burst', 'scripts', 'commit',
        'aggregated-devices', 'ethernet', 'device-count', 'alarm', 'management-ethernet', 'link-down', 'ignore', 'interfaces', 'unit', 'family', 'filter', 'input',
        'inet', 'snmp', 'community', 'clients', 'restrict', 'read-only', 'forwarding-options', 'storm-control-profiles', 'all', 'bandwidth-level', 'no-unknown-unicast',
        'default', 'routing-options', 'static', 'route', 'next-hop', 'forwarding-table', 'export', 'ECMP', 'lldp', 'lldp-med','port-id-subtype', 'interface', 'interface-name',
        'l2-learning', 'global-mac-table-aging-time', 'policy-options', 'policy-statement', 'then', 'load-balance', 'per-packet', 'firewall', 'term', 'accept', 'discard',
        'from', 'destination-port', 'vlans', 'vlan-id', 'ospf', 'area', 'reference-bandwidth', 'interface-type', 'p2p', 'iccp', 'local-ip-addr', 'peer', 'backup-liveness-detection',
        'backup-peer-ip', 'liveness-detection', 'minimum-interval', 'multiplier', 'session-establishment-hold-time', 'uplink-failure-detection', 'group', 'link-to-disable',
        'igmp-snooping', 'bfd', 'traceoptions', 'flag', 'error', 'pipe-detail', 'packet', 'bgp', 'import', 'log-updown', 'multipath', 'neighbor', 'description', 'as-override',
        'remove-private', 'peer-as', 'multihop', 'routing-instances', 'class-of-service', 'scheduler-maps', 'forwarding-class', 'scheduler', 'schedulers', 'buffer-size',
        'priority', 'transmit-rate', 'shared-buffer', 'egress', 'buffer-partition', 'percent', 'lossless', 'lossy', 'multicast', 'chassis', 'fpc', 'pic', 'port-range',
        'channel-speed', 'multi-chassis', 'multi-chassis-protection', 'emergency', 'l3-interface', 'interface-shutdown-action', 'hard-shutdown', 'udp', 'switch-options',
        'prefer', 'vlan', 'rstp', 'edge', 'bpdu-block-on-edge', 'vlan-id-list', 'uplink_ufd', 'ethernet-switching', 'ether-options', 'auto-negotiation', 'trunk', 'mtu',
        'disable', 'interface-mode', 'members', 'storm-control', '802.3ad', 'aggregated-ether-options', 'lacp', 'active', 'periodic', 'slow', 'address', 'action-shutdown',
        'destination-address','source-port', 'finger', 'protocol', 'tcp', 'ssh', 'access', 'telnet', 'ftp', 'passive', '*', 'redundancy', 'graceful-switchover', 'hold-time',
        'up', 'down', 'routing-instance-access', 'nonstop-routing', 'port', 'irb', 'vrrp-group', 'virtual-address', 'qualified-next-hop', 'metric', 'implicit_permit',
        'protected_as_network', 'deny_vrrp', 'ip-protocol', 'vrrp', 'mc-ae', 'mc-ae-id', 'disable-auto-speed-detection', 'no-preempt', 'count', 'service-id', 'instance-type',
        'virtual-router', 'system-id', 'chassis-id', 'l2-interface', 'preferred', 'mac', 'accept-data', 'prefix-list-filter', 'exact', 'longer', 'orlonger']

        for cmd in cmdList:
            self.cmdDict[cmd] = 1