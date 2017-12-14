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

    d3.selectAll('svg').remove();

    var radial = new RadialBarChart('#radial', 'assets/fips-and-percent.csv', sendHeight);

  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
