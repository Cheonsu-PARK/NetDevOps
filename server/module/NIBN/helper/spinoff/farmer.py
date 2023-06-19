import os
from .configTranslator import getTranslator

class ConfigFarmer:
    def __init__(self, target):
        self.version = '0.0.0'
        self.target = target
        self.config = open('module/NIBN/archive/' + target, 'r').readlines()
        self.fairway = ''
        self.confChunk = []
        self.searched = []
        self.candidate = []
        self.wanted = dict()
        self.translator = getTranslator()
        if 'n9k' in target:
            self.vendor = 'cisco'
        else:
            self.vendor = 'juniper'

    def navigate(self, target):
        fmt, keys, harvests = self.study(target)
        findKey = False
        for conf in self.config:
            if fmt[0] in conf:
                self.confChunk.append(conf)
                findKey = True
            else:
                if findKey and int(fmt[1].strip('\n')) and conf[0] == ' ':
                    self.confChunk.append(conf)
                elif findKey:
                    break

        findKey = False
        for conf in self.confChunk:
            maximum = 0
            longestMatch = -1
            hiddenKey = ' '
            for keyIdx, key in enumerate(keys):
                hit = 0
                keyWays = key.split(',')
                for keyWayIdx, keyWay in enumerate(keyWays):
                    if keyWayIdx == 0:
                        if keyWay in conf:
                            hit += 1
                    else:
                        if hiddenKey + keyWay in conf:
                            hit += 1
                if hit > maximum and hit >= len(keyWays):
                    maximum = hit
                    longestMatch = keyIdx
            if longestMatch != -1:
                self.searched.append([conf.strip('\n'), longestMatch])

        key = ''
        for conf in self.searched:
            vals = []
            confRaw = conf[0]
            idx = conf[1]
            masks = harvests[idx]
            keyDiscover = False
            for mask in masks:
                if '(key)' in mask:
                    key = mask
                    keyDiscover = True
                else:
                    vals.append(int(mask))

            confPiece = conf[0].split()
            if keyDiscover:
                try:
                    key = self.translator[confPiece[int(key.split('(key)')[0])]]
                except:
                    key = confPiece[int(key.split('(key)')[0])]

            wantedLine = ''
            for val in vals:
                try:
                  wantedLine += self.translator[confPiece[val]] + ' '
                except:
                  wantedLine += confPiece[val] + ' '

            try:
                self.wanted[key].append(wantedLine.strip(' '))
            except:
                self.wanted[key] = []
                if wantedLine == '':
                    continue
                self.wanted[key].append(wantedLine.strip(' '))

        for key in self.wanted.keys():
            print(key)
            for val in self.wanted[key]:
                print('\u00a0\u00a0\u00a0\u00a0\u00a0' + val)

    def study(self, target):
        book = open('module/NIBN/helper/spinoff/library/' + self.vendor + target.split(',')[0], 'r').readlines()
        fmt = []
        guidLine = []
        mainPoint = []
        for idx, page in enumerate(book):
            word = page.split('||')
            if idx == 0:
                fmt = [word[1], word[2]]
                continue
            if target == word[0]:
                guidLine.append(word[1])
                mainPoint.append(word[2].split(','))
        return fmt, guidLine, mainPoint
