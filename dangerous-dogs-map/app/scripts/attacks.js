/* global pym */

(function() {
  'use strict';

  var pymChild, dogMap = null;

  function render() {

    function sendHeight () {
      if (pymChild) {
        pymChild.sendHeight();
      }
    }

    d3.selectAll('svg').remove();

    DogMap.getData(function (data) {
      if (DogMap.buildInteractiveMap && !dogMap) {
        dogMap = DogMap.buildInteractiveMap('interactive-map-attacks', data, 'Severe Bodily Injury');
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
