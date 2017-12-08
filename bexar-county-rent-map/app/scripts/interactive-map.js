/* global L, d3, Awesomplete, _ */

var RentMap = (function (maps) {
  'use strict';

  function InteractiveMap (el, data) {
    this.container = d3.select('#' + el);
    if (this.container.empty()) { return; }
    this.width = this.getContainerWidth();
    this.height = this.getHeight();
    this.map = this.generateMapInstance(el);
    this.stylelayer = this.getStyleLayer();
    this.dataLayer = this.setDataLayer(data);
    this.bindEvents();
  }

  InteractiveMap.prototype = {
    bbox: [ -104.0458814, 26.0696823, -93.7347459, 36.4813628 ],

    getWindowWidth: function () {
      return window.innerWidth > 620 ? 620 : window.innerWidth;
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

    generateMapInstance: function (el) {
      var settings = this.getSettings();
      L.mapbox.accessToken = 'pk.eyJ1Ijoic2Flbi1lZGl0b3JzIiwiYSI6ImNpeXVreTZ6YjAwenYycW15d3hoNmp1aTEifQ.OjH869qC5JzcGVVy-rg4JQ';
      this.container.style('width', this.width + 'px').style('height', this.height + 'px');
      return L.map(el, settings);
    },

    getSettings: function () {
      var zoom = this.width < 720 ? 10 : 11;
      return {
        center: [29.40, -98.470],
        zoom: zoom,
        minZoom: 9,
        maxZoom: 18,
        scrollWheelZoom: false,
        attributionControl: false,
      };
    },

    getStyleLayer: function () {
      var url = 'mapbox://styles/saen-editors/cj8lz9cbp6d0i2ro29ef2422q';
      return L.mapbox.styleLayer(url).addTo(this.map);
    },

    setDataLayer: function (data) {
      return L.geoJSON(data, {
        style: function (feature) {
        return {color: feature.properties.rent}; // set colors with d3 or custom function then bind to map
        // http://leafletjs.com/reference-1.2.0.html#geojson
      }); //.bindPopup(this.setPopup.bind(this));
    },

    setPopup: function (layer) {
      var props = layer.feature.properties,
          operator = this.firstLetterToUppercase(props.operator),
          priority = this.addPriorityToPopup(props.priority),
          result = '';

      result += 'This orphan well is operated by ' + operator;
      result += ' and has been inactive for ' + props.months_inactive + ' months'; // jshint ignore:line
      result += priority;
      return result;
    },

    firstLetterToUppercase: function (str) {
      return str.toLowerCase().replace(/\b[a-z]/g, function (f) { return f.toUpperCase(); });
    },

    addPriorityToPopup: function (priority) {
      if (priority) {
        return ' with a priority level of ' + priority + '.';
      } else {
        return '.';
      }
    },

    bindEvents: function () {
      this.map.on('zoomend', this.addRemoveWells, this);
    },

    addRemoveWells: function (e) {
      var zoom = e.target.getZoom(),
          hasWells = this.map.hasLayer(this.dataLayer);
      if (zoom >= 8) {
        if (!hasWells) {
          this.map.addLayer(this.dataLayer);
        }
        this.getWellRadius(zoom);
      } else if (hasWells) {
        this.map.removeLayer(this.dataLayer);
      }
    },

    getWellRadius: function (zoom) {
      var sm = 100,
          med = 400,
          lg = 1000;
      if (zoom <= 9) {
        this.setWellRadius(lg);
      } else if (zoom <= 11) {
        this.setWellRadius(med);
      } else {
        this.setWellRadius(sm);
      }
    },

    setWellRadius: function (newRadius) {
      var currRadius = this.dataLayer.getLayers()[0].getRadius();
      if (currRadius !== newRadius) {
        this.dataLayer.invoke('setRadius', newRadius);
      }
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
      this.map.setView(latlng, 9);
      this.clearAutocompleteResults();
    },

    handleGeocodeError: function (err) {
      console.error(err);
    },
  };

  maps.buildInteractiveMap = function (el, wells) {
    if (L) {
      var interactiveMap = new InteractiveMap(el, wells);
      if (interactiveMap.map) {
        new Geocoder(interactiveMap.map, interactiveMap.bbox);
      }
      return interactiveMap;
    }
  };

  return maps;

}(RentMap || {}));
