/* global pym, d3, ElectionMap */

// Here's the EPSG code you need to convert the .shp: EPSG:4326

(function() {
  'use strict';

  var pymChild;

  function render() {

    function sendHeight () {
      if (pymChild) {
        pymChild.sendHeight();
      }
    }

    ElectionMap.getData(function (shapes) {
      if (ElectionMap.buildMap) {
        ElectionMap.buildMap('map', shapes);
      }

      sendHeight();
    });
  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();

