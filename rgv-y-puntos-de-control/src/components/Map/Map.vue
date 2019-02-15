<template>
    <div id="rgv-map"></div>
</template>

<script>
import * as d3 from 'd3';

require('mapbox.js'); // global... ugh

import data from '../../assets/features.json';

const L = window.L;

class RgvMap {
    constructor(id, data) {
        this.container  = d3.select(`#${id}`);
        this.bbox       = this.getBBox();
        this.width      = this.getContainerWidth();
        this.height     = this.getHeight();
        this.map        = this.generateMapInstance(id);
        this.stylelayer = this.getStyleLayer();
        this.dataLayer  = this.setDataLayer(data);
    }

    isMobile() {
        return window.innerWidth < 500;
    }

    getBBox() {
        return [-98.89480591, 22.06937385, -98.04336548, 22.81800834];
    }

    getWindowWidth() {
        return window.innerWidth > 960 ? 960 : window.innerWidth;
    }

    getContainerWidth() {
        const paddingLeft  = parseFloat(this.container.style('padding-left'));
        const paddingRight = parseFloat(this.container.style('padding-right'));
        
        return Math.round(this.getWindowWidth() - paddingLeft - paddingRight);
    }

    getHeight() {
        return Math.round(this.width * 0.5);
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
        center: [26.620, -98.097],
        zoom: this.isMobile() ? 7 : 8,
        minZoom: 5,
        maxZoom: 19,
        scrollWheelZoom: false,
        attributionControl: false,
      };
    }

    generateMapInstance(id) {
        const settings = this.getSettings();
        L.mapbox.accessToken = 'pk.eyJ1IjoibHVrZXdoeXRlIiwiYSI6IlZHaDVCQjQifQ.yUYnbLVrkSRq2Akdyirobg';
        this.container.style('width', this.width + 'px').style('height', this.height + 'px');
        return L.map(id, settings);
    }

    getStyleLayer() {
      const url = 'mapbox://styles/lukewhyte/cjqpm6izt0mtb2sslh97eqkw1';
      return L.mapbox.styleLayer(url).addTo(this.map);
    }

    getLineRadius(latlng, miles) {
        return (miles / 69) / Math.cos(latlng.lat);
    }

    buildLine(point, latlng, radius) {
        return L.polyline([
            [latlng.lat, latlng.lng - radius],
            latlng,
            [latlng.lat, latlng.lng + radius],
        ], { className: 'checkpoint' });
    }

    setPopup(layer) {
        return layer.feature.properties.desc;
    }

    setDataLayer(data) {
      return L.geoJSON(data, {
        pointToLayer: (point, latlng) => {
            if (point.properties.type === 'line') {
                return this.buildLine(point, latlng, this.getLineRadius(latlng, point.properties.miles));
            } else {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: '//s.hdnux.com/photos/76/21/66/16326069/4/rawImage.png',
                        iconSize: [33, 38],
                    }),
                });
            }
        },
      }).bindPopup(this.setPopup).addTo(this.map);
    }
}

export default {
    name: 'rgv-map',
    mounted() {
        new RgvMap('rgv-map', data);
    },
}
</script>

<style land="scss">
    @import './mapbox.3.0.1.css';

        .leaflet-popup-content-wrapper {
            background: #434675;
            color: #fff;
            font-size: 14px;
            line-height: 24px;
        }

        .leaflet-popup-content-wrapper a {
            color: rgba(255,255,255,0.5);
        }

        .leaflet-popup-tip-container {
            width: 30px;
            height: 15px;
        }

        .leaflet-popup-tip {
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 15px solid #434675;
        }

        .leaflet-top { z-index: 800; }

        path.checkpoint {
            stroke: #b12125;
            stroke-width: 3.6;
        }
</style>
