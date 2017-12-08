/* global L, d3, Awesomplete, _ */

var RentMap = (function (maps) {
  'use strict';

  var colorArr = ['#f6d2a9', '#f3aa84', '#ea8171', '#d55d6a', '#b13f64'];

  function InteractiveMap (el, data) {
    this.container = d3.select('#' + el);
    if (this.container.empty()) { return; }
    this.width      = this.getContainerWidth();
    this.height     = this.getHeight();
    this.getColor   = this.setColorScale(data);
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
        style: function (feature) {
          return {
            weight: 0.5,
            color: '#444',
            opacity: 0.5,
            fillColor: that.getColor(feature.properties.rent),
            fillOpacity: 0.6,
            lineCap: 'square',
            className: 'rent',
          };
        }
      }).bindPopup(this.setPopup).addTo(this.map);
    },

    setPopup: function (layer) {
      var props = layer.feature.properties;
      return 'This is ' + props.name + '. The median rent here is $' + props.rent + '.';
    },
  };

  function Geocoder(map, bbox) {
    this.input = document.querySelector('.form-group input#search');
    this.map = map;
    this.bbox = bbox;
    this.autocomplete = new Awesomplete(this.input);
    this.autocomplete.coords = {};
    this.timeout = {};
    this.address = '';
    this.geocoder = L.mapbox.geocoder('mapbox.places');
    this.captureEvent = this.captureEvent.bind(this);
    this.populateAutocomplete = this.populateAutocomplete.bind(this);
    this.handleRawStringResult = this.handleRawStringResult.bind(this);
    this.bindEvents();
  }

  Geocoder.prototype = {
    bindEvents: function () {
      this.input.addEventListener('keyup', this.captureEvent);
      window.addEventListener('awesomplete-selectcomplete', this.getLatLngFromSuggestions.bind(this));
    },

    captureEvent: function (e) {
      this.clearGeoTimeout();
      this.address = e.target.value;
      if (e.keyCode === 13) { // enter key
        this.getLatLngFromInput();
      }
      else if (this.address.length > 1) {
        this.setGeoTimeout();
      } else {
        this.clearAutocompleteResults();
      }
    },

    clearAutocompleteResults: function () {
      this.autocomplete.list = [];
      this.autocomplete.coords = {};
    },

    setGeoTimeout: function () {
      this.timeout = window.setTimeout(this.getLocation.bind(this, this.populateAutocomplete), 500);
    },

    clearGeoTimeout: function () {
      window.clearTimeout(this.timeout);  
    },

    getLocation: function (callback) {
      var address = this.address,
          bbox = this.bbox;
      this.clearAutocompleteResults();
      this.geocoder.query({
        query: address,
        bbox: bbox,
        autocomplete: true,
        country: 'us',
      }, callback);
    },

    populateAutocomplete: function (err, result) {
      var suggestions = [],
          coords = this.autocomplete.coords;
      if (err) {
        this.handleGeocodeError(err);
      } else {
        _.forEach(result.results.features, function (feature) {
          suggestions.push(feature.place_name); // jshint ignore:line
          coords[feature.place_name] = [feature.center[1], feature.center[0]]; // jshint ignore:line
        });
        this.autocomplete.list = suggestions;
      }
    },

    handleRawStringResult: function (err, result) {
      if (err) {
        this.handleGeocodeError(err);
      } else {
        var features = result.results.features;
        if (features.length) {
          var place = features[0];
          this.input.value = this.address = place.place_name; // jshint ignore:line
          this.panToLocation([place.center[1], place.center[0]]);
        } else {
          this.clearAutocompleteResults();
          this.autocomplete.list = ['Address not found, please reenter'];
        }
      }
    },

    getLatLngFromSuggestions: function (e) {
      var coords = this.autocomplete.coords[e.text.value];
      if (coords) {
        this.panToLocation(coords);
      } else {
        console.error('no latlng associated with address');
        this.clearAutocompleteResults();
      }
    },

    getLatLngFromInput: function () {
      var coords = this.autocomplete.coords[this.address];
      if (coords) {
        this.panToLocation(coords);
      } else {
        this.getLocation(this.handleRawStringResult);
      }
    },

    panToLocation: function (latlng) {
      this.map.setView(latlng, 14);
      this.clearAutocompleteResults();
    },

    handleGeocodeError: function (err) {
      console.error(err);
    },
  };

  maps.buildInteractiveMap = function (el, data) {
    if (L) {
      var interactiveMap = new InteractiveMap(el, data);
      if (interactiveMap.map) {
        new Geocoder(interactiveMap.map, interactiveMap.bbox);
      }
      return interactiveMap;
    }
  };

  return maps;

}(RentMap || {}));
