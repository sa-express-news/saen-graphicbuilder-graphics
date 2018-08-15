/* global pym, $, Bloodhound, _ */

(function() {
  'use strict';

  var pymChild, $billSearch;

  function render() {
    SchoolSearch.$schoolSearchInit(pymChild);

    if (pymChild) {
      pymChild.sendHeight();
    }
  }

  function load() {
    pymChild = new pym.Child({
      renderCallback: render
    });
  }

  window.onload = load;
})();
