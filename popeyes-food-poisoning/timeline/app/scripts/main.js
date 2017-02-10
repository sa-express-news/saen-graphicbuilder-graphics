/* global pym, $ */

(function() {
  'use strict';

  var pymChild;

  function render() {

    // add js here

  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
