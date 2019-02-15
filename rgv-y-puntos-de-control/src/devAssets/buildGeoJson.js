#! /usr/bin/env node
const fs        = require('fs');
const turf      = require('@turf/turf');

const pollosMedina = turf.point([-98.3187786, 26.2542359], {
    type: 'point',
    desc: 'La ubicación principal de Pollos Medina antes de que fuera cerrada',
});

const checkpointData = [
    {
        coords: [-98.1383922, 27.0251725],
        props: {
            desc: 'Control de la Patrulla Fronteriza de Falfurrias',
            type: 'line',
            miles: 2.8,
        },
    },
    {
        coords: [-97.7941051, 27.0161741],
        props: {
            desc: 'Control de la Patrulla Fronteriza de Turcotte',
            type: 'line',
            miles: 2.2,
        },
    },
    {
        coords: [-98.6936323, 27.2830126],
        props: {
            desc: 'Control de la Patrulla Fronteriza de Hebbronville',
            type: 'line',
            miles: 4,
        },
    },
]

const checkpoints = checkpointData.map(point => {
    return turf.point(point.coords, point.props);
});

const res = {
    "type": "FeatureCollection",
    "features": [pollosMedina].concat(checkpoints),
};

fs.writeFile('../assets/features.json', JSON.stringify(res), function(err) {
    if(err) {
        return console.log(err);
    }

    return console.log("features.geojson was created");
}); 