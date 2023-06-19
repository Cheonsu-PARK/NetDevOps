import os
import sys
import spinoff.farmer

def run(target, key):
    ambObj = spinoff.farmer.ConfigFarmer(target)
    ambObj.navigate(key)

run(sys.argv[1], sys.argv[2])
