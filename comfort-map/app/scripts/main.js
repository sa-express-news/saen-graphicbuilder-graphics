/* global pym, MapFactory */

(function() {
  'use strict';

  var pymChild;

  function sendHeight () {
    if (pymChild) {
      pymChild.sendHeight();
    }
  }

  function render() {

    MapFactory.getData('assets/locations.geojson', function (data) {
      MapFactory.buildMap('map', data);
      sendHeight();
    });

    sendHeight();
  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
