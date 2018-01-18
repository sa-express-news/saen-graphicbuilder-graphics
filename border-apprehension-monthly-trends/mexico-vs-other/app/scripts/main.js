/* global pym, buildLineChart */

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

    var chart = buildLineChart('#line-chart', 'assets/mx-or-not-data.json', sendHeight);

  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
