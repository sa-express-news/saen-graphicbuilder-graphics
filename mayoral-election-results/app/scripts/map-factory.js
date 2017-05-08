/* global, L, d3, ElectionMap */

var ElectionMap = (function (map) {
  'use strict';

  function MapFactory (id, data) {
    var that = this;
    this.container = d3.select('#' + id);
    this.width = this.getWidth();
    this.height = this.getHeight();
    this.map = this.generateMapInstance(id);
    this.tileLayer = this.getStyleLayer();
    this.sourcesLayer = this.setSources(data);
  }

  MapFactory.prototype = {
    bbox: [ -97.98706054687501, 29.744109309616512, -98.97583007812501, 29.090976994322702 ],

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
        center: [29.403114116064064, -98.47320556640626],
        zoom: 10,
        minZoom: 10,
        maxZoom: 17,
        scrollWheelZoom: true,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/saen-editors/cj2f3njzz00402so4yxaznr22';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    setFillOpacity: function (props) {
      if (props['Winner'] === 'Tie') {
        return 0.2;
      } else {
        var share = props['Votes for ' + props['Winner']] / props['Total votes']
        return share < 0.16 ? 0.1 : (Math.round(share * 100) / 100) - 0.05;
      }
    },

    setSources: function (data) {
      var that = this;
      return L.geoJSON(data, {
        style: function (feature) {
          return {
            stroke: false,
            fillColor: feature.properties.Color,
            fillOpacity: that.setFillOpacity(feature.properties),
          };
        }
      }).bindPopup(L.popup({
        offset: L.point(0, -25),
      }).setContent(this.setPopup.bind(this))).addTo(this.map);
    },

    isWinner: function (props, name) {
      return name === props['Winner'];
    },

    getPercent: function (props, name) {
      return Math.round((props['Votes for ' + name] / props['Total votes']) * 100) + '%';
    },

    writeLine: function (props, name) {
      if (!this.isWinner(props, name)) {
        return name + ': ' + this.getPercent(props, name) + '<br />';
      } else {
        return '';
      }
    },

    setPopup: function (layer) {
      var props = layer.feature.properties;
      var result = '<span>' + props['Winner'] + ': ' + this.getPercent(props, props['Winner']) + '</span><br />';
      result += this.writeLine(props, 'Taylor');
      result += this.writeLine(props, 'Villarreal');
      result += this.writeLine(props, 'Adkisson');
      result += this.writeLine(props, 'Van de Putte');
      return result;
    },
  };

  map.buildMap = function (el, data) {
    if (L) {
      return new MapFactory(el, data);
    }
  };

  return map;

}(ElectionMap || {}));