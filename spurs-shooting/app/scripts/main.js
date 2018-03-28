/* global pym, ShotChart */

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

    var shotChart = new ShotChart('#shot-chart', 'assets/game.csv', sendHeight);

  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
