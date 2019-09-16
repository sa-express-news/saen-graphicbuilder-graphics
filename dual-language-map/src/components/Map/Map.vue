<template>
    <div>
        <div id="school-map"></div>
    </div>
</template>

<script>
import * as d3  from 'd3';
import * as L from 'leaflet';

class SchoolMap {
    constructor(id, dataLayer) {
        this.container  = d3.select(`#${id}`);
        this.bbox       = this._getBBox();
        this.width      = this._getContainerWidth();
        this.height     = this._getHeight();
        this.map        = this._generateMapInstance(id);
        this.stylelayer = this._getStyleLayer();
        
        this._setDataLayer(dataLayer);
        this._handleEvents();
    }

    _isMobile() {
        return window.innerWidth < 500;
    }

    _getBBox() {
        return [-97.98706054687501, 29.744109309616512, -98.85583007812501, 29.090976994322702];
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
        return Math.round(this.width * this._getRatio());
    }

    _getRatio() {
        return this._getBoxHeight() / this._getBoxWidth();
    }

    _getBoxWidth() {
        return this.bbox[2] - this.bbox[0];
    }

    _getBoxHeight() {
        return this.bbox[3] - this.bbox[1];
    }

    _getSettings() {
        return {
            center: [29.463114116064064, -98.50320556640626],
            zoom: this._isMobile() ? 9 : 10,
            minZoom: 9,
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
    }

    refreshDataLayer(dataLayer) {
        if (this.dataLayer) {
            this.dataLayer.remove();
        }
        this._setDataLayer(dataLayer);
    }
}

const setColor = school => school.isDualLanguage === 'True' ? '#FF2E2E' : '#337CA0';

const writePopup = school => {
    let result = '';
    result += `Campus: ${school.campus} <br />`;
    result += `District: ${school.district} <hr />`;
    result += 'STAAR score avg per program: <ul>';
    result += ` <li>Two-Way Dual Language: ${school.twoWay}</li>`;
    result += ` <li>One-Way Dual Language: ${school.oneWay}</li>`;
    result += ` <li>All ELL student avg: ${school.ell}</li>`;
    result += ` <li>All student avg: ${school.all}</li></ul>`;
    return result;
};

const getCircle = school => L.circle([school.latitude, school.longitude], {
    color: setColor(school),
    weight: 1,
    opacity: 0.8,
    radius: 400,
    fillOpacity: 0.4,
    popup: writePopup(school),
});

export default {
    name: 'school-map',
    props: {
        schools: Array,
    },
    data() {
        return { map: null };
    },
    computed: {
        dataLayer() {
            return L.featureGroup(this.schools.map(getCircle)).bindPopup(
                L.popup({ offset: L.point(0, 0) }).setContent(layer => layer.options.popup)
            );
        }
    },
    watch: {
        dataLayer() {
            this.map.refreshDataLayer(this.dataLayer);
        },
    },
    methods: {
        setColor(school) {
            return school.isDualLanguage === 'True' ? '#FF2E2E' : '#337CA0';
        },
        setPopup(school) {
            let result = '';
            result += `Campus: ${school.campus} <br />`;
            result += `District: ${school.district} <hr />`;
            result += 'STAAR score avg per program: <br />';
            result += ` - Two-Way Dual Language: ${school.twoWay} <br />`
            result += ` - One-Way Dual Language: ${school.oneWay} <br />`
            result += ` - All ELL student avg: ${school.ell} <br />`
            result += ` - All student avg: ${school.all} <br />`
            return result;
        },
        setCircle(school) {
            return L.circle([school.latitude, school.longitude], {
                color: this.setColor(school),
                weight: 1,
                opacity: 0.8,
                radius: 400,
                fillOpacity: 0.4,
                popup: this.setPopup(school),
            });
        }, 
    },
    mounted() {
        this.map = new SchoolMap('school-map', this.dataLayer);
    },
}

</script>

<style lang="scss">
    #school-map {
        .leaflet-popup-content ul {
            padding-left: 20px;
        }
    }
</style>