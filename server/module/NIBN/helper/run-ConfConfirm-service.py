import os
import sys
import shutil

def run(args):
    confirmList = args.strip(',').split(',')
    print(confirmList)
    for confirmFile in confirmList:
        shutil.copyfile(os.getcwd() + '/module/NIBN/archive/' + confirmFile, os.getcwd() + '/module/NIBN/confirm/' + confirmFile)
    print('SUCCESS')

run(sys.argv[1])
