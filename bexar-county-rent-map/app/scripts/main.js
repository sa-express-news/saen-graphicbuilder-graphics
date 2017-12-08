/* global pym */

(function() {
  'use strict';

  var pymChild, rentMap = null;

  function render() {

    function sendHeight () {
      if (pymChild) {
        pymChild.sendHeight();
      }
    }

    d3.selectAll('svg').remove();

    RentMap.getData(function (data) {
      if (RentMap.buildInteractiveMap && !rentMap) {
        rentMap = RentMap.buildInteractiveMap('interactive-well-map', data);
      }

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
