from sys import argv
from os.path import exists
import json
import csv
 
script, in_csv, in_json, out_file = argv

geojson = {
    "type": "FeatureCollection",
    "crs": {"type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
    "features": []
}

countCsv = 0
countResult = 0

def buildProperties(result):
    props = {}
    props['precinct'] = result[0]
    props['Madrid'] = int(result[1])
    props['Roles'] = int(result[2])
    props['Flores'] = int(result[3])
    props['Idrogo'] = int(result[4])
    props['Nirenberg'] = int(result[5])
    props['McLeod'] = int(result[6])
    props['Velasquez'] = int(result[7])
    props['Medina'] = int(result[8])
    props['Mama Bexar'] = int(result[9])
    props['Lucke'] = int(result[10])
    props['Smith'] = int(result[11])
    props['Taylor'] = int(result[12])
    props['Ponce'] = int(result[13])
    props['Diaz'] = int(result[14])                     
    props['Total votes'] = int(result[15])
    props['Winner'] = result[18]
    props['Color'] = result[23]
    return props

with open(in_csv, 'rU') as raw:
    raw.next()
    csv_data = csv.reader(raw)

    with open(in_json) as json_data:
        precinct_data = json.load(json_data)

        for result in csv_data:
            countCsv += 1
            feature = {
                "type": "Feature",
            }

            for precinct in precinct_data['features']:
                precinctProps = precinct['properties']

                if precinctProps['Shape_Area'] == float(result[44]) and precinctProps['TOTAL'] == float(result[39]):
                    countResult += 1
                    feature["geometry"] = precinct['geometry']
                    feature['properties'] = buildProperties(result)
                    geojson['features'].append(feature)               

output = open(out_file, 'w')
json.dump(geojson, output)
 
print geojson
print countCsv
print countResult 