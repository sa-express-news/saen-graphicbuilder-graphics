from sys import argv
from os.path import exists
import simplejson as json
import csv
 
script, in_file, out_file = argv

def trimAddress(address):
    endIdx = address.find(' San Antonio')
    if endIdx is -1:
        endIdx = len(address)
    return address[:endIdx]

with open(in_file) as raw:
    raw.next()
    data = csv.reader(raw, delimiter=',')
 
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    for d in data:
        if d[0] == '2016':
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(d[3]), float(d[2])],
                },
                "properties": {
                    "address": trimAddress(d[1]),
                    "year": d[0],
                    "dot": d[4]
                },
            }

            geojson['features'].append(feature)



    output = open(out_file, 'w')
    json.dump(geojson, output)
     
    print len(geojson['features'])