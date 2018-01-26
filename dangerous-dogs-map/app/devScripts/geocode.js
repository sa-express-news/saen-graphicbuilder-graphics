require('dotenv').config(); // store ure API key in .env under API_KEY key
const apiKey = process.env.API_KEY;

const fs 	= require('fs');
const geo 	= require('mapbox-geocoding');
const _		= require('lodash');

geo.setAccessToken(apiKey);

geo.setQueryParams({
	types: 'address',
	country: 'us',
	'bbox': [-98.89480591, 29.06937385, -98.04336548, 29.81800834],
});

let geojson = {
	type: 'FeatureCollection',
	features: [],
};

const getData = () => new Promise((resolve, reject) => fs.readFile('app/devAssets/dogs.json', 'utf8', (err, data) => {
	if (err) reject(err);
	else resolve(JSON.parse(data));
}));

const geocodeAddresses = properties => new Promise((resolve, reject) => {
	// Geocode an address to coordinates
	return geo.geocode('mapbox.places', properties.Address, function (err, geoData) {
		if (err) reject(properties.Address, err)
		else {
			const { type, geometry } = geoData.features[0];
			resolve({
				type,
				geometry,
				properties,
			});
		}
	});
});

const writeFile = master => {
	fs.writeFile('app/assets/geoDogs.geojson', JSON.stringify(master), 'utf8', function (err) {
		if (err) {
	        return console.log(err);
	    }
	    console.log("The file was saved!");
	});
};

const run = async () => {
	const data = await getData();
	if (data) {
		geojson.features = await Promise.all(data.map(geocodeAddresses)).catch(err => console.error(err));
		writeFile(geojson);
	}
};

run();