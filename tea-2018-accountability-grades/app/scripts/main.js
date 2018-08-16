/* global pym, $, Bloodhound, _ */

(function() {
  'use strict';

  var pymChild, $billSearch;

  function sendHeight () {
    if (pymChild) {
      pymChild.sendHeight();
    }
  }

  function render() {

    function sendHeight () {
      if (pymChild) {
        pymChild.sendHeight();
      }
    }

    SchoolSearch.getData(function (data) {
      if (SchoolSearch.$schoolSearchInit) {
        SchoolSearch.$schoolSearchInit(data, sendHeight);
      }
      if (SchoolSearch.tableInit) {
        SchoolSearch.tableInit(data, sendHeight);
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
