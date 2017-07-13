const turf = require('@turf/turf');
const fs   = require('fs');
const _	   = require('lodash');

const locations = {
	comfort: [-98.90503369999999, 29.967715],
	ranch: [-98.925345, 29.93975],
};

function getBuffer(feature) {
	const miles = feature.properties.name === 'comfort' ? 20 : 4;
    return turf.buffer(feature, miles, 'miles');
}

function makePoint(coords, name) {
	return turf.point(coords, { name });
}

let result = turf.featureCollection([]);
result.features = _.map(_.map(locations, makePoint), getBuffer);

fs.writeFileSync('../assets/locations.geojson', JSON.stringify(result));
