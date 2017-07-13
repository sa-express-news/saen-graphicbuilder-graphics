/* global, L, d3 */

var MapFactory = (function (map) {
  'use strict';

  function MapFactory (id, data) {
    this.container = d3.select('#' + id);
    this.data = data;
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.map = this.generateMapInstance(id);
    this.tileLayer = this.getStyleLayer();
    this.sourcesLayer = this.setSources();
  }

  MapFactory.prototype = {
    bbox: [ -106.85302734375001, 23.50355189742412, -91.03271484375001, 37.23032838760387 ],

    getWidth: function () {
      return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth);
    },

    getHeight: function () {
      return Math.round(this.width * this.getRatio());
    },

    getRatio: function () {
      return this.getBoxHeight() / this.getBoxWidth();
    },

    getBoxWidth: function () {
      return this.bbox[2] - this.bbox[0];
    },

    getBoxHeight: function () {
      return this.bbox[3] - this.bbox[1];
    },

    generateMapInstance: function (el) {
      var settings = this.getSettings();
      L.mapbox.accessToken = 'pk.eyJ1Ijoic2Flbi1lZGl0b3JzIiwiYSI6ImNpeXVreTZ6YjAwenYycW15d3hoNmp1aTEifQ.OjH869qC5JzcGVVy-rg4JQ';
      this.container.style('width', this.width + 'px').style('height', this.height + 'px');
      return L.map(el, settings);
    },

    getSettings: function () {
      return {
        center: [29.710, -98.667],
        zoom: this.width < 720 ? 8 : 9,
        minZoom: 5,
        maxZoom: 14,
        scrollWheelZoom: false,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/saen-editors/cj51a2iob15j32rrs7bm0b65n';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    setSources: function () {
      var zoom = this.map.getZoom();
      return L.geoJSON(this.data, {
        filter: this.filterByZoom.bind(this, zoom),
      }).addTo(this.map);
    },

    filterByZoom: function (zoom, feature) {
      if (feature.properties.name === 'comfort') {
        return zoom >= 8;
      } else {
        return zoom < 8;
      }
    },

    resetSources: function () {
      this.map.removeLayer(this.sourcesLayer);
      return this.setSources();
    },
  };

  map.buildMap = function (el, data) {
    if (L) {
      return new MapFactory(el, data);
    }
  };

  map.getData = function (src, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", src, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(xhr.response);
      } else {
        return console.error(status);
      }
    };
    xhr.send();
  };

  return map;

}(MapFactory || {}));