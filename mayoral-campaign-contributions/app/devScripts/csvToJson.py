from sys import argv
from os.path import exists
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
    candidates[candidate]['total'] += amount

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
    obj['candidate'] = key
    candidateList.append(obj)

sortedCandidateList = sorted(candidateList, key=lambda k: k['total'], reverse=True)
print sortedCandidateList[0: 10]



output = open(out_file, 'w')
json.dump(candidates, output)
 
print len(candidates)