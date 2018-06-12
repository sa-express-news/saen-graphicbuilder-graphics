/* global pym, $, Bloodhound, _ */

(function() {
  'use strict';

  var pymChild, $billSearch;

  function render() {
    var $campus = $('#campus'),
        bars = {
          rmeets: $('span#rmeets'),
          mmeets: $('span#mmeets'),
        },
        meta = {
          rank: $('span#rank'),
          regiontotal: $('span#regiontotal'),
          type: $('span#type'),
        };

    var campusDefault = {
      campus: 'Alamo Heights H S',
      rmeets: 62.9268293,
      mmeets: 30.7692308,
      rank: 32,
      regiontotal: 78,
      type: 'High',
    };

    function roundToWhole (num) {
      return Math.round(num);
    }

    function isOutside(num) {
      return num < 4;
    }

    function addClassToBar($bar, newClass) {
      $bar.children('.bar-value').addClass(newClass);
    }

    function getBarMax (datum) {
      return 100;
    }

    function drawBars (datum, max) {
      _.forEach(bars, function ($bar, key) {
        if (datum[key]) {
          $('.' + key).show();
          $bar.width((datum[key] / max) * 100 + '%').children('.bar-value').text(roundToWhole(datum[key]) + '%');
          if(isOutside(datum[key])) {
            addClassToBar($bar, 'outside');
          }
        } else {
          $('.' + key).hide();
        }
      });
    }

    function drawMeta (datum) {
      _.forEach(meta, function ($meta, key) {
        if (datum[key]) {
          $meta.text(datum[key]);
        }
      });
    }

    function populateTemplate (datum) {
      drawBars(datum, getBarMax(datum));
      drawMeta(datum);
    }

    function renderCampus(datum) {
      $campus.text(datum.campus);
      $('.bar-value').removeClass('outside');
      populateTemplate(datum);
    }

    renderCampus(campusDefault);

    var searchCampuses = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('campus'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'assets/campus-results.json'
      },
      ttl: 3600000 // One hour
    });

    searchCampuses.initialize();

    $billSearch = $('#search').typeahead({
      autoselect: true,
      hint: false,
      highlight: false,
      minLength: 2,
    }, {
      name: 'staar',
      limit: 50,
      displayKey: function(obj) {
        return obj.campus;
      },
      source: searchCampuses.ttAdapter()
    });

    $billSearch.on('typeahead:selected', function(e, datum) {
      e.stopPropagation();
      renderCampus(datum);
      pymChild.sendHeight();
    });

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
