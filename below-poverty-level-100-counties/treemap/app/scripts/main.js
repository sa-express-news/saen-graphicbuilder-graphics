/* global pym, TreeMap */

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

    var treemap = new TreeMap('#treemap', 'assets/treemap-data.csv', sendHeight);

  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
