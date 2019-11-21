<template>
    <div>
        <div id="packing-shed-map"></div>
    </div>
</template>

<script>
import { select } from 'd3-selection';
import * as L from 'leaflet';

class PackingShedMap {
    constructor(id, dataLayer) {
        this.container  = select(`#${id}`);
        this.width      = this._getContainerWidth();
        this.height     = this._getHeight();
        this.zoomLevel  = 'max';
        this.map        = this._generateMapInstance(id);
        this.stylelayer = this._getStyleLayer();
        
        this._setDataLayer(dataLayer);
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
            center: this._isMobile() ? [32.119, -105.448] : [32.472, -107.138],
            zoom: 5,
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
        const url = `https://api.mapbox.com/styles/v1/saen-editors/ck0l8j31e322t1co0884pu2yf/tiles/256/{z}/{x}/{y}@2x?access_token=${accessToken}`
        return L.tileLayer(url, { accessToken }).addTo(this.map);
    }

    _setDataLayer(dataLayer) {
        this.dataLayer = dataLayer;
        this.dataLayer.addTo(this.map);
    }

    _toggleScrollWheelZoom() {
        if (!this.map.scrollWheelZoom.enabled()) {
            this.map.scrollWheelZoom.enable();
        }
    }

    _handleEvents() {
        this.map.on('mousedown', this._toggleScrollWheelZoom, this);
        this.map.on('zoomend', () => {
            let zoom = this.map.getZoom();
            if (zoom < 6 && this.zoom >=6) {
                this.adjustRadius(zoom);
            } else if (zoom > )
            // this.dataLayer
        })
    }

    refreshDataLayer(dataLayer) {
        if (this.dataLayer) {
            this.dataLayer.remove();
        }
        this._setDataLayer(dataLayer);
    }
}

export default {
    name: 'packing-shed-map',
    props: {
        sheds: Object,
    },
    data() {
        return { 
            map: null,

        };
    },
    computed: {
        dataLayer() {
            return L.geoJSON(this.sheds, {
                pointToLayer: this.setCircle,
            }).bindPopup(
                L.popup({ offset: L.point(0, -25) }).setContent(layer => layer.options.popup)
            );
        }
    },
    methods: {
        setPopup({ properties }) {
            return 'Whoop';
            // let result = '';
            // result += `Campus: ${properties.campus} <br />`;
            // result += `District: ${properties.district} <hr />`;
            // result += 'STAAR score avg per program: <ul>';
            // result += ` <li>Two-Way Dual Language: ${properties.twoWay}</li>`;
            // result += ` <li>One-Way Dual Language: ${properties.oneWay}</li>`;
            // result += ` <li>Avg of all EL students: ${properties.ell}</li>`;
            // result += ` <li>All student avg: ${properties.all}</li></ul>`;
            // return result;
        },
        setCircle(feature, latlng) {
            const { radius } = feature.properties;
            return L.circle(latlng, {
                color: '#FF2E2E',
                fillColor: '#FF2E2E',
                weight: 1,
                opacity: 0.5,
                radius: 10000 * radius,
                fillOpacity: 0.1,
                popup: this.setPopup(feature),
            });
        }, 
    },
    mounted() {
        this.map = new PackingShedMap('packing-shed-map', this.dataLayer);
    },
}

</script>

<style lang="scss">
    #packing-shed-map {
        .leaflet-popup-content ul {
            padding-left: 20px;
        }
    }
</style>