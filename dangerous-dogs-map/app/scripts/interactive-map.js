/* global L, d3, _ */

var DogMap = (function (maps) {
  'use strict';

  var colorMap = {
    'Dangerous Dogs': 'rgba(138,7,7,1)',
    'Severe Bodily Injury': 'rgba(138,7,7,1)'
  };

  function InteractiveMap (el, data, target) {
    this.container = d3.select('#' + el);
    if (this.container.empty()) { return; }
    this.width      = this.getContainerWidth();
    this.height     = this.getHeight();
    this.target     = target;
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
      L.mapbox.accessToken = 'pk.eyJ1IjoibHVrZXdoeXRlIiwiYSI6IlZHaDVCQjQifQ.yUYnbLVrkSRq2Akdyirobg';
      this.container.style('width', this.width + 'px').style('height', this.height + 'px');
      return L.map(el, settings);
    },

    getSettings: function () {
      var isMobile = this.width < 500;
      return {
        center: isMobile ? [29.44378, -98.49655] : [29.45903, -98.50891],
        zoom: isMobile ? 10 : 11,
        minZoom: 9,
        maxZoom: 19,
        scrollWheelZoom: false,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/lukewhyte/cjqplcumy1ir72spfmajtob5i';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    getRadius: function (count) {
      return count * 300;
    },

    getColor: function () {
      return colorMap[this.target];
    }, 

    buildCircle: function (props, latlng) {
      if (props[this.target]) {
        return L.circle(latlng, {
          radius: this.getRadius(props[this.target]),
          color: this.getColor(),
          weight: 1,
          fill: true,
          fillColor: this.getColor(this.target),
          fillOpacity: 0.2,
        });
      } else return null;
    },

    setDataLayer: function (data) {
      var buildCircle = this.buildCircle.bind(this);
      return L.geoJSON(data, {
        pointToLayer: function (point, latlng) {
          return buildCircle(point.properties, latlng);
        },
      }).bindPopup(this.setPopup.bind(this)).addTo(this.map);
    },

    setLanguage: function (num) {
      if (this.target === 'Dangerous Dogs') {
        var isAre = num === 1 ? ' is ' : ' are ';
        var dog = num === 1 ? ' dog ' : ' dogs ';
        return isAre + num + ' dangerous' + dog;
      } else {
        var wasWere = num === 1 ? ' was ' : ' were ';
        var attack = num === 1 ? ' attack ' : ' attacks ';
        return wasWere + num + attack + 'resulting in severe bodily injury ';
      }
    },

    setPopup: function (layer) {
      var props = layer.feature.properties;
      var num   = props[this.target];
      var isAre = num === 1 ? ' is ' : ' are ';
      var dog   = num === 1 ? ' dog ' : ' dogs ';
      return 'There' + this.setLanguage(num) + 'at this address: ' + props.Address + '.';
    },
  };

  maps.buildInteractiveMap = function (el, data, target) {
    if (L) {
      var map = new InteractiveMap(el, data, target);
      return map;
    }
  };

  return maps;

}(DogMap || {}));
