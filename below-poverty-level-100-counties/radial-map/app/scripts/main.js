/* global pym, RadialBarChart */

(function() {
  'use strict';

  var pymChild;

  function sendHeight () {
    if (pymChild) {
      pymChild.sendHeight();
    }
  }

  function render() {

    RadialBarChart.buildChart();

    sendHeight();
  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
