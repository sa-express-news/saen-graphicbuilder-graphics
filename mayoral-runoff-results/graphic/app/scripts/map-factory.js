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
    this.handleEvents();
  }

  MapFactory.prototype = {
    bbox: [ -97.98706054687501, 29.744109309616512, -98.97583007812501, 29.090976994322702 ],

    candidates: [
      'Nirenberg',
      'Taylor'
    ],

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
        scrollWheelZoom: false,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/saen-editors/cj2f3njzz00402so4yxaznr22';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    setFillOpacity: function (props) {
      if (props.Winner === 'Tie') {
        return 0.2;
      } else if (props.Winner === 'No votes') {
        return 0;
      } else {
        var share = props[props.Winner] / props['Total votes'];
        if (share < 0.16) {
          return 0.1;
        } else if (share > 0.8) {
          return 0.8;
        } else {
          return (Math.round(share * 100) / 100) - 0.05;
        }
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

    getPercent: function (votes, total) {
      return Math.round((votes / total) * 100);
    },

    writeLine: function (candidate, props) {
      var percent = this.getPercent(candidate.votes, props['Total votes']);
      return percent ? candidate.name + ': ' + percent + '%<br />' : '';
    },

    writeWinner: function (candidate, props) {
      return '<span>' + candidate.name + ': ' + this.getPercent(candidate.votes, props['Total votes']) + '%</span><br />';
    },

    findTopCandidates: function (props) {
      var candidates = this.candidates.slice();
      candidates.sort(function(a, b) {
        return parseFloat(props[b]) - parseFloat(props[a]) ;
      });

      return candidates.slice(0, 3).map(function (name) {
        return {
          name: name,
          votes: props[name],
        };
      });
    },

    setPopup: function (layer) {
      var props = layer.feature.properties,
          candidates = this.findTopCandidates(props),
          isTie = props.Winner === 'Tie',
          result = '';

      if (isTie) {
        result += '<span>Tie</span><br />';
      }

      candidates.forEach(function (candidate, index) {
        if (index === 0 && !isTie) {
          result += this.writeWinner(candidate, props);
        } else {
          result += this.writeLine(candidate, props);
        }
      }, this);

      result += 'Total # of votes: ' + props['Total votes'] + '<br />';
      result += 'Precinct #: ' + props.precinct;
      return result;
    },

    toggleScrollWheelZoom: function () {
      if (!this.map.scrollWheelZoom.enabled()) {
        this.map.scrollWheelZoom.enable();
      }
    },

    handleEvents: function () {
      this.map.on('click', this.toggleScrollWheelZoom, this);
    },
  };

  map.buildMap = function (el, data) {
    if (L) {
      map.isBuilt = true;
      return new MapFactory(el, data);
    }
  };

  map.isBuilt = false;

  return map;

}(ElectionMap || {}));