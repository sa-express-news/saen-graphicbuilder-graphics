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
      var zoom = this.width < 620 ? 13 : 14;
      return {
        center: [29.435, -98.531],
        zoom: zoom,
        minZoom: 10,
        maxZoom: 16,
        scrollWheelZoom: true,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/saen-editors/cj0lj73fh000f2snsbcdgdd52';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    setSources: function (data) {
      return L.geoJSON(data, {
        pointToLayer: this.addFeatures.bind(this)
      }).addTo(this.map);
    },

    addFeatures: function (point, latlng) {
      var popup = this.setPopup(point);
      return L.featureGroup([
        L.circle(latlng, {
          radius: 40,
          fillOpacity: 0.6,
          color: '#ca0020',
          weight: 1
        }).bindPopup(popup),
        L.circle(latlng, {
          radius: 70,
          fill: false,
          color: '#ca0020',
          weight: 1
        })
      ]);
    },

    setPopup: function (feature) {
      var props = feature.properties;
      return '<span>Homicide location:</span> ' + props.address;
    },
  };

  map.buildMap = function (el, data) {
    if (L) {
      return new MapFactory(el, data);
    }
  };

  map.getData = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", 'assets/prospect-homicides.json', true);
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