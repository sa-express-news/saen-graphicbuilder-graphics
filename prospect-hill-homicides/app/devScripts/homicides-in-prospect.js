var turf      = require('@turf/turf'),
    fs        = require('fs'),
    homicides = JSON.parse(fs.readFileSync('../assets/homicides.json')),
    prospect  = JSON.parse(fs.readFileSync('../assets/prospect-hill.json'));

var total = 0;

var centers = turf.within(homicides, prospect);
var rings = turf.buffer(centers, 0.01, 'miles');

centers.features.forEach(function () { total += 1; });
console.log(total);

fs.writeFileSync('../assets/prospect-homicides.json', JSON.stringify(centers));
fs.writeFileSync('../assets/prospect-homicides-rings.json', JSON.stringify(rings));
