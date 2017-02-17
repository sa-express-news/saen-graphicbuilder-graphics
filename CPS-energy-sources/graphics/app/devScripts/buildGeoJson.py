from sys import argv
import simplejson as json
from pykml import parser

script, in_file, out_file = argv

geojson = {
    "type": "FeatureCollection",
    "features": []
}

markers = {
	"Nuclear": "nuclear.png",
	"Coal": "coal.png",
	"Natural gas": "gas.png",
	"Solar farm": "solar.png",
	"Wind farm": "wind.png",
	"Landfill gas": "landfill.png",
	"Retired CPS Energy power plants": "retired.png"
}

kml = parser.parse(open(in_file)).getroot()

folders = kml.Document.Folder

for folder in folders:
	source = folder.name.text
	for placemark in folder.Placemark:
		coords = [x.strip() for x in placemark.Point.coordinates.text.split(',')]
		feature = {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [coords[0], coords[1]]
			},
			"properties": {
				"name": placemark.name.text,
				"description": placemark.description.text,
				"marker": "assets/images/" + markers[source]
			}
		}

		geojson['features'].append(feature)

output = open(out_file, 'w')
json.dump(geojson, output)
 
print geojson
