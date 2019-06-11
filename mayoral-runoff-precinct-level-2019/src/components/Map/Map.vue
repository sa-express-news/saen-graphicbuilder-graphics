<template>
    <div id="precinct-map"></div>
</template>

<script>
import * as d3  from 'd3';

const topojson = require('topojson');
require('mapbox.js');

import topo from '../../assets/precinct-results-topo.json';

const L = window.L;

const topoToGeoJSON = (topo, obj) => topojson.feature(topo, obj);

class PrecinctMap {
    constructor(id, data) {
        this.container  = d3.select(`#${id}`);
        this.bbox       = this.getBBox();
        this.width      = this.getContainerWidth();
        this.height     = this.getHeight();
        this.map        = this.generateMapInstance(id);
        this.stylelayer = this.getStyleLayer();
        this.dataLayer  = this.setDataLayer(data);
        this.handleEvents();
    }

    isMobile() {
        return window.innerWidth < 500;
    }

    getBBox() {
        return [-97.98706054687501, 29.744109309616512, -98.85583007812501, 29.090976994322702];
    }

    getWindowWidth() {
        return window.innerWidth > 760 ? 760 : window.innerWidth;
    }

    getContainerWidth() {
        const paddingLeft  = parseFloat(this.container.style('padding-left'));
        const paddingRight = parseFloat(this.container.style('padding-right'));

        return Math.round(this.getWindowWidth() - paddingLeft - paddingRight);
    }

    getHeight() {
        return Math.round(this.width * this.getRatio());
    }

    getRatio() {
        return this.getBoxHeight() / this.getBoxWidth();
    }

    getBoxWidth() {
        return this.bbox[2] - this.bbox[0];
    }

    getBoxHeight() {
        return this.bbox[3] - this.bbox[1];
    }

    getSettings() {
        return {
            center: [29.423114116064064, -98.47320556640626],
            zoom: this.isMobile() ? 9 : 10,
            minZoom: 9,
            maxZoom: 17,
            scrollWheelZoom: false,
            attributionControl: false,
        };
    }

    generateMapInstance(id) {
        const settings = this.getSettings();
        L.mapbox.accessToken = 'pk.eyJ1Ijoic2Flbi1lZGl0b3JzIiwiYSI6ImNpeXVreTZ6YjAwenYycW15d3hoNmp1aTEifQ.OjH869qC5JzcGVVy-rg4JQ';
        this.container.style('width', this.width + 'px').style('height', this.height + 'px');
        return L.map(id, settings);
    }

    getStyleLayer() {
        const url = 'mapbox://styles/saen-editors/cj2f3njzz00402so4yxaznr22';
        return L.mapbox.styleLayer(url).addTo(this.map);
    }

    setDataLayer(data) {
        return L.geoJSON(this.removeNoVotePrecincts(Object.assign({}, data)), {
            style: feature => {
                return {
                    stroke: false,
                    fillColor: feature.properties.Color,
                    fillOpacity: this.setFillOpacity(feature.properties),
                };
            }
        }).bindPopup(L.popup({
            offset: L.point(0, -25),
        }).setContent(this.setPopup.bind(this))).addTo(this.map);
    }

    removeNoVotePrecincts(data) {
        data.features = data.features.filter(feature => feature.properties.Winner !== 'No votes');
        return data;
    }

    setFillOpacity(props) {
        if (props.Winner === 'Tie') {
            return 0.2;
        } else {
            const share = (Math.round(props[props.Winner] / props['Total votes'] * 100) / 100) + 0.08;
            if (share < 0.16) {
                return 0.1;
            } else if (share === 1) {
                return 0.9;
            } else {
                return share;
            }
        }
    }

    setPopup(layer) {
        const props         = layer.feature.properties;
        const candidates    = this.findTopCandidates(props);
        const isTie         = props.Winner === 'Tie';
        let result          = '';

        if (isTie) {
            result += '<span>Tie</span><br />';
        }

        candidates.forEach((candidate, index) => {
            if (index === 0 && !isTie) {
                result += this.writeWinner(candidate, props);
            } else {
                result += this.writeLine(candidate, props);
            }
        }, this);

        result += 'Total # of votes: ' + props['Total votes'] + '<br />';
        result += 'Precinct #: ' + props.precinct;
        return result;
    }

    findTopCandidates(props) {
        const candidates = this.getCandidates();
        candidates.sort((a, b) => {
            return parseFloat(props[b]) - parseFloat(props[a]) ;
        });

        return candidates.slice(0, 3).map(name => {
            return {
                name,
                votes: props[name],
            };
        });
    }

    getCandidates() {
        return ['Nirenberg','Brockhouse'];
    }

    writeWinner(candidate, props) {
        return `<span>${candidate.name}: ${this.getPercent(candidate.votes, props['Total votes'])}%</span><br />`;
    }

    writeLine(candidate, props) {
        const percent = this.getPercent(candidate.votes, props['Total votes']);
        return percent ? `${candidate.name}: ${percent}%<br />` : '';
    }

    getPercent(votes, total) {
      return Math.round((votes / total) * 100);
    }

    toggleScrollWheelZoom() {
        if (!this.map.scrollWheelZoom.enabled()) {
            this.map.scrollWheelZoom.enable();
        }
    }

    handleEvents() {
        this.map.on('mousedown', this.toggleScrollWheelZoom, this);
    }
}

export default {
    name: 'precinct-map',
    mounted() {
        new PrecinctMap('precinct-map', topoToGeoJSON(topo, topo.objects['precinct-results']));
    },
}

</script>

<style lang="scss">
    @import './mapbox.3.0.1.css';

    #precinct-map {
        .leaflet-popup-content span {
            font-weight: bold;
        }
    }
</style>