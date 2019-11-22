<template>
    <div>
        <div id="packing-shed-map"></div>
    </div>
</template>

<script>
import { select } from 'd3-selection';
import * as L from 'leaflet';

const getRadiusMap = () => {
    let i = 3, radiusMap = {};
    for (i; i < 18; i++) {
        if (i < 6) {
            radiusMap[i] = 10000;
        } else {
            switch(i) {
                case 6:
                    radiusMap[i] = 6000;
                    break;
                case 7:
                    radiusMap[i] = 4000;
                    break;
                case 8:
                    radiusMap[i] = 1000;
                    break;
                case 9:
                    radiusMap[i] = 400;
                    break;
                case 10:
                    radiusMap[i] = 300;
                    break;
                case 11:
                    radiusMap[i] = 200;
                    break;
                case 12:
                    radiusMap[i] = 100;
                    break;
                default:
                    radiusMap[i] = 50;
            }
        }
    }
    return radiusMap;
};

class PackingShedMap {
    constructor(id, dataLayer, radiusMap) {
        this.container  = select(`#${id}`);
        this.width      = this._getContainerWidth();
        this.height     = this._getHeight();
        this.radiusMap  = radiusMap;
        this.radius     = this.radiusMap[5]
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
            center: this._isMobile() ? [28.558, -102.637] : [32.472, -107.138],
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

    _adjustRadius(zoom) {
        this.dataLayer.eachLayer(layer => {
            const { radius } = layer.feature.properties;
            layer.setRadius(this.radiusMap[zoom] * radius);
        });
        this.radius = this.radiusMap[zoom];
    }

    _handleEvents() {
        this.map.on('mousedown', this._toggleScrollWheelZoom, this);
        this.map.on('zoomend', () => {
            let zoom = this.map.getZoom();
            if (this.radiusMap[zoom] != this.radius) {
                this._adjustRadius(zoom);
            }
        });
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
                L.popup({
                    offset: L.point(0, -25),
                    maxWidth: 250,
                }).setContent(layer => layer.options.popup)
            );
        }
    },
    methods: {
        setPopup({ properties }) {
            const { title, violations, cmps, bwatp, eeatp, start, end, address } = properties;
            let result = `<strong>${title}: ${start} - ${end}</strong><hr />`;
            result += `The Labor Dept found <strong>${violations}</strong> violation${violations > 1 ? 's' : ''} `;
            result += `and the company agreed to pay <strong>$${bwatp}</strong> `;
            result += `in back wages to <strong>${eeatp}</strong> employees. `
            result += cmps > 0 ? `<strong>$${cmps}</strong> in penalties were issued.` : '';
            result += `<hr />Address: ${address}`
            return result;
        },
        setCircle(feature, latlng) {
            const { radius } = feature.properties;
            return L.circle(latlng, {
                color: '#FF2E2E',
                fillColor: '#FF2E2E',
                weight: 1.5,
                opacity: 0.5,
                radius: 10000 * radius,
                fillOpacity: 0.1,
                className: 'shed',
                popup: this.setPopup(feature),
            });
        }, 
    },
    mounted() {
        this.map = new PackingShedMap('packing-shed-map', this.dataLayer, getRadiusMap());
    },
}

</script>

<style lang="scss">
    #packing-shed-map {
        .leaflet-popup-content ul {
            padding-left: 20px;
        }
        .leaflet-overlay-pane path.shed:hover {
            stroke-width: 3;
        }
    }
</style>