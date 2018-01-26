/* global L, d3, _ */

var RentMap = (function (maps) {
  'use strict';

  var colorArr = ['#f6d2a9', '#f3aa84', '#ea8171', '#d55d6a', '#b13f64'];

  function InteractiveMap (el, data) {
    this.container = d3.select('#' + el);
    if (this.container.empty()) { return; }
    this.width      = this.getContainerWidth();
    this.height     = this.getHeight();
    // this.getColor   = this.setColorScale(data);
    this.map        = this.generateMapInstance(el);
    this.stylelayer = this.getStyleLayer();
    this.dataLayer  = this.setDataLayer(data);
  }

  InteractiveMap.prototype = {
    bbox: [-98.89480591, 29.06937385, -98.04336548, 29.81800834 ],

    getWindowWidth: function () {
      return window.innerWidth > 720 ? 720 : window.innerWidth;
    },

    getContainerWidth: function () {
      var paddingLeft  = parseFloat(this.container.style('padding-left')),
          paddingRight = parseFloat(this.container.style('padding-right')),
          width = this.getWindowWidth();

      return Math.round(width - paddingLeft - paddingRight);
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

    setColorScale: function (data) {
      var rentArr = data.features.map(function (feature) {
        return feature.properties.rent;
      });
      return d3.scaleQuantile().domain(rentArr).range(colorArr);
    },

    generateMapInstance: function (el) {
      var settings = this.getSettings();
      L.mapbox.accessToken = 'pk.eyJ1Ijoic2Flbi1lZGl0b3JzIiwiYSI6ImNpeXVreTZ6YjAwenYycW15d3hoNmp1aTEifQ.OjH869qC5JzcGVVy-rg4JQ';
      this.container.style('width', this.width + 'px').style('height', this.height + 'px');
      return L.map(el, settings);
    },

    getSettings: function () {
      var zoom = this.width < 720 ? 9 : 10;
      return {
        center: [29.4384, -98.4801],
        zoom: zoom,
        minZoom: 9,
        maxZoom: 19,
        scrollWheelZoom: false,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/saen-editors/cjaxkh3iv3cps2rpds7c4ja2y';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    setDataLayer: function (data) {
      var that = this;
      return L.geoJSON(data, {
        pointToLayer: function (point, latlng) {
          return L.circle(latlng, {radius: 20})
        },
      }).bindPopup(this.setPopup).addTo(this.map);
    },

    setPopup: function (layer) {
      var props = layer.feature.properties;
      return 'This is ' + props.name + '. The median rent here is $' + props.rent + '.';
    },
  };

  maps.buildInteractiveMap = function (el, data) {
    if (L) {
      return new InteractiveMap(el, data);;
    }
  };

  return maps;

}(RentMap || {}));
