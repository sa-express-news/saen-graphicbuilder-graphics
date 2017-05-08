from sys import argv
from os.path import exists
import simplejson as json
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
    props['Votes for Taylor'] = int(result[5])
    props['Votes for Villarreal'] = int(result[6])
    props['Votes for Adkisson'] = int(result[7])
    props['Votes for Van de Putte'] = int(result[8])
    props['Total votes'] = int(result[17])
    props['Winner'] = result[22]
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

                if precinctProps['Shape_Area'] == float(result[32]) and precinctProps['TOTAL'] == float(result[27]):
                    countResult += 1
                    feature["geometry"] = precinct['geometry']
                    feature['properties'] = buildProperties(result)
                    geojson['features'].append(feature)               

output = open(out_file, 'w')
json.dump(geojson, output)
 
print geojson
print countCsv
print countResult 
