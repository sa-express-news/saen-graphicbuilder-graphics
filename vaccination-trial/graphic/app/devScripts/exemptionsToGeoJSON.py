from sys import argv
from os.path import exists
import simplejson as json 

script, geo_file, data_file, out_file = argv

geo = json.load(open(geo_file))
data = json.load(open(data_file))

dataKeys = ("2015-2016",)
count = 0

for geoCounty in geo['features']:
    for dataCounty in data:
        if geoCounty['properties']['COUNTY'].startswith(dataCounty['County']):
            props = geoCounty['properties']
            props['COUNTY'] = dataCounty['County']
            for key in dataKeys:    
                props[key] = dataCounty[key]
            props.pop('STATE_FIPS', None)
            props.pop('STATE', None)
            props.pop('FIPS', None)
            props.pop('SQUARE_MIL', None)
            count += 1

output = open(out_file, 'w')
json.dump(geo, output)

print(count)
