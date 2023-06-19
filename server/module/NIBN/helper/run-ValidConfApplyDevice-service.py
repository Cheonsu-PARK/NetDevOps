import sys
import os
import paramiko
import shutil

def run(target):
    f = open(os.getcwd() + '/module/NIBN/confirm/' + target)
    oobIP = ''
    for confLine in f.readlines():
      if 'em0' in confLine or 'me0' in confLine:
        if 'address' in confLine:
          targetLine = confLine.split(' ')
          oobIP = targetLine[len(targetLine) - 1]
    print(oobIP.strip('\n'))
    f.close()
    try:
      f = open(os.getcwd() + '/module/NIBN/confirm/' + target)
      ssh = paramiko.SSHClient()
      ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
      ssh.connect(str(oobIP), port='22',  username='cspark911', password='')
      for confLine in f.readlines():
        print(confLine.strip('\n'))
        stdin, stdout, stderr = ssh.exec_command(confLine.strip('\n'))
        rets = stdout.readlines()
        print(rets)
      f.close()
    except Exception as err:
      print(err)

run(sys.argv[1])
