import os
import json

class Refinner:
    def __init__(self, dev):
        self.version = '0.0.0'
        self.dev = dev

    def refine(self):
        confFile = open(self.dev.confFile, 'r')
        refineConf = []
        for line in confFile.readlines():
            if line[0] == '\n':
                continue
            refineConf.append(line)

        confFile.close()
        confFile = open(self.dev.confFile, 'w')
        for line in refineConf:
            confFile.write(line)
        confFile.close()