/* global pym, d3, VaccinationMap */

(function() {
  'use strict';

  var pymChild;

  function render() {

    function sendHeight () {
      if (pymChild) {
        pymChild.sendHeight();
      }
    }

    VaccinationMap.getData(function (shapes) {
      if (VaccinationMap.buildMap) {
        d3.selectAll('svg').remove();
        VaccinationMap.buildMap('map', shapes);
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
