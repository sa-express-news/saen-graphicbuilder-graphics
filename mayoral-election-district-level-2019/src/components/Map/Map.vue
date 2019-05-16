<template>
    <div id="district-map"></div>
</template>

<script>
import * as d3  from 'd3';

const topojson = require('topojson');
require('mapbox.js');

import topo from '../../assets/district-results-topo.json';

const L = window.L;

const topoToGeoJSON = (topo, obj) => topojson.feature(topo, obj);

class DistrictMap {
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
            center: [29.463114116064064, -98.50320556640626],
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
        return L.geoJSON(data, {
            style: feature => {
                return {
                    color: '#000000',
                    weight: 1,
                    opacity: 0.65,
                    fillColor: feature.properties.Color,
                    fillOpacity: this.setFillOpacity(feature.properties),
                };
            }
        }).bindPopup(L.popup({
            offset: L.point(0, -25),
        }).setContent(this.setPopup.bind(this))).addTo(this.map);
    }

    setFillOpacity(props) {
        const share = (Math.round(props[props.Winner] / props['Total votes'] * 100) / 100) + 0.08;
        if (share < 0.16) {
            return 0.1;
        } else if (share === 1) {
            return 0.9;
        } else {
            return share;
        }
    }

    setPopup(layer) {
        const props         = layer.feature.properties;
        const candidates    = this.sortCandidates(props);
        let result          = '';

        candidates.forEach((candidate, index) => {
            if (index === 0) {
                result += this.writeWinner(candidate, props);
            } else {
                result += this.writeLine(candidate, props);
            }
        }, this);

        result += 'Total # of votes: ' + props['Total votes'] + '<br />';
        result += 'District #: ' + props.district;
        return result;
    }

    sortCandidates(props) {
        const candidates = this.getCandidates();
        candidates.sort((a, b) => {
            return parseFloat(props[b]) - parseFloat(props[a]) ;
        });

        return candidates.map(name => {
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
    name: 'district-map',
    mounted() {
        new DistrictMap('district-map', topoToGeoJSON(topo, topo.objects['district-results']));
    },
}

</script>

<style lang="scss">
    @import './mapbox.3.0.1.css';

    #district-map {
        .leaflet-popup-content span {
            font-weight: bold;
        }
    }
</style>