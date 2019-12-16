<template>
    <div>
        <div id="highway-map"></div>
    </div>
</template>

<script>
import { select } from 'd3-selection';
import * as L from 'leaflet';

class HighwayMap {
    constructor(id) {
        this.container  = select(`#${id}`);
        this.width      = this._getContainerWidth();
        this.height     = this._getHeight();
        this.map        = this._generateMapInstance(id);
        this.stylelayer = this._getStyleLayer();
        
        this._handleEvents();
    }

    _isMobile() {
        return window.innerWidth < 500;
    }

    _getWindowWidth() {
        return window.innerWidth > 760 ? 760 : window.innerWidth;
    }

    _getContainerWidth() {
        const paddingLeft  = parseFloat(this.container.style('padding-left'));
        const paddingRight = parseFloat(this.container.style('padding-right'));

        return Math.round(this._getWindowWidth() - paddingLeft - paddingRight);
    }

    _getHeight() {
        return Math.round(this.width * 0.65);
    }

    _getSettings() {
        return {
            center: [29.95, -100.68],
            zoom: this._isMobile() ? 4 : 5,
            minZoom: 3,
            maxZoom: 17,
            scrollWheelZoom: false,
            attributionControl: false,
        };
    }

    _generateMapInstance(id) {
        const settings = this._getSettings();
        this.container.style('width', this.width + 'px').style('height', this.height + 'px');
        return L.map(id, settings);
    }

    _getStyleLayer() {
        const accessToken = 'pk.eyJ1Ijoic2Flbi1lZGl0b3JzIiwiYSI6ImNpeXVreTZ6YjAwenYycW15d3hoNmp1aTEifQ.OjH869qC5JzcGVVy-rg4JQ';
        const url = `https://api.mapbox.com/styles/v1/saen-editors/ck3f5s0pk0j3r1cocg22j3y9d/tiles/256/{z}/{x}/{y}@2x?access_token=${accessToken}`
        return L.tileLayer(url, { accessToken }).addTo(this.map);
    }

    _toggleScrollWheelZoom() {
        if (!this.map.scrollWheelZoom.enabled()) {
            this.map.scrollWheelZoom.enable();
        }
    }

    _handleEvents() {
        this.map.on('mousedown', this._toggleScrollWheelZoom, this);
    }
}

export default {
    name: 'highway-map',
    data() {
        return { 
            map: null,
        };
    },
    mounted() {
        this.map = new HighwayMap('highway-map');
    },
}

</script>

<style lang="scss"></style>