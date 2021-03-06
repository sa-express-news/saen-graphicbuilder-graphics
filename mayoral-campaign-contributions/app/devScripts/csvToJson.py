from sys import argv
from os.path import exists
from collections import Counter
import simplejson as json
import csv
 
script, in_file, out_file = argv

candidates = {}

def addNewCandidate(candidate, amount):
    newEntry = {}
    newEntry['total'] = 0.0
    candidates[candidate] = newEntry

def addToAmount(candidate, industry, amount):
    candidates[candidate][industry] += amount

def addNewIndustry(candidate, industry, amount):
    candidates[candidate][industry] = amount

def addToTotal(candidate, amount):
    newTotal = round(candidates[candidate]['total'] + amount, 2)
    candidates[candidate]['total'] = newTotal

def sortToTopFour(obj):
    counted = Counter(obj)
    result = {}
    for key, val in counted.most_common(6):
        result[key] = val
    return result


with open(in_file, 'rU') as raw:
    raw.next()
    data = csv.reader(raw)

    for donation in data:
        candidate = donation[2]
        industry = donation[4]
        amount = float(donation[3])
        if candidate not in candidates:
            addNewCandidate(candidate, amount)

        if industry:
            if industry in candidates[candidate]:
                addToAmount(candidate, industry, amount)
            else:
                addNewIndustry(candidate, industry, amount)

            addToTotal(candidate, amount)


candidateList = []
for key, obj in candidates.iteritems():
    for val in obj:
        obj[val] = int(obj[val])
    obj = sortToTopFour(obj)
    obj['candidate'] = key
    candidateList.append(obj)

sortedCandidateList = sorted(candidateList, key=lambda k: k['total'], reverse=True)

output = open(out_file, 'w')
json.dump(sortedCandidateList[1: 9], output)
 
print sortedCandidateList[1: 9]