<template>
    <div id="school-map"></div>
</template>

<script>
import * as d3  from 'd3';
import * as L from 'leaflet';

import schools from '../../assets/bexar-schools.csv';

class SchoolMap {
    constructor(id, data) {
        this.container  = d3.select(`#${id}`);
        this.bbox       = this.getBBox();
        this.width      = this.getContainerWidth();
        this.height     = this.getHeight();
        this.map        = this.generateMapInstance(id);
        this.stylelayer = this.getStyleLayer();
        this.dataLayer  = this.setDataLayer(data);
        // this.handleEvents();
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
        this.container.style('width', this.width + 'px').style('height', this.height + 'px');
        return L.map(id, settings);
    }

    getStyleLayer() {
        const accessToken = 'pk.eyJ1Ijoic2Flbi1lZGl0b3JzIiwiYSI6ImNpeXVreTZ6YjAwenYycW15d3hoNmp1aTEifQ.OjH869qC5JzcGVVy-rg4JQ';
        const url = `https://api.mapbox.com/styles/v1/saen-editors/ck0l8j31e322t1co0884pu2yf/tiles/256/{z}/{x}/{y}@2x?access_token=${accessToken}`
        return L.tileLayer(url, { accessToken }).addTo(this.map);
    }

    setDataLayer(data) {
        return L.featureGroup(data.filter(
            school => school.isDualLanguage === 'True'
        ).map(school => L.circle([school.latitude, school.longitude], {
            color: '#FF2E2E',
            weight: 1,
            opacity: 0.8,
            radius: 400,
            fillOpacity: 0.4,
            popup: this.writePopup(school),
        }))).bindPopup(
            L.popup({ offset: L.point(0, -4) }).setContent(this.setPopup)
        ).addTo(this.map);
    }

    writePopup(school) {
        let result = '';
        result += `Campus: ${school.campus} <br />`;
        result += `District: ${school.district}`;
        return result;
    }

    setPopup(layer) {
        return layer.options.popup;
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
        new SchoolMap('school-map', schools);
    },
}

</script>

<style lang="scss">
    #district-map {
        .leaflet-popup-content span {
            font-weight: bold;
        }
    }
</style>