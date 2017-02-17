/* global, L, d3 */

var MapFactory = (function (map) {
  'use strict';

  function MapFactory (id, data) {
    this.container = d3.select('#' + id);
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.map = this.generateMapInstance(id);
    this.tileLayer = this.getStyleLayer();
    this.sourcesLayer = this.setSources(data);
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
      var zoom = this.width < 620 ? 5 : 6;
      return {
        center: [31.297, -99.954],
        zoom: zoom,
        minZoom: 5,
        maxZoom: 14,
        scrollWheelZoom: false,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/saen-editors/ciz7imm8s001p2rmufn5uidgk';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    setSources: function (data) {
      return L.geoJSON(data, {
        pointToLayer: function (point, latlng) {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: point.properties.marker,
              iconSize: [28, 56],
              iconAnchor: [14, 56],
            })
          });
        }
      }).bindPopup(L.popup({
        offset: L.point(0, -25),
      }).setContent(this.setPopup.bind(this))).addTo(this.map);
    },

    setPopup: function (layer) {
      var props = layer.feature.properties;
      return '<span>' + props.name + ':</span><br />' + props.description;
    },
  };

  map.buildMap = function (el, data) {
    if (L) {
      return new MapFactory(el, data);
    }
  };

  map.getData = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", 'assets/sources.json', true);
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