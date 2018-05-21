/* global pym, $, Bloodhound, _ */

(function() {
  'use strict';

  var pymChild, $billSearch;

  function render() {
    var $campus = $('#campus'),
        bars = {
          notmeet: $('span#notmeet'),
          approaches: $('span#approaches'),
          meets: $('span#meets'),
          masters: $('span#masters'),
        };

    var campusDefault = {
      campus: 'Hardy Oak El',
      notmeet: 7.27699531,
      approaches: 92.7230047,
      meets: 78.1690141,
      masters: 57.2769953,
    };

    function roundToWhole (num) {
      return Math.round(num);
    }

    function drawBars (datum) {
      var max = _.reduce(bars, function (max, val, key) { 
        return datum[key] > max ? datum[key] : max; 
      }, 0);

      max = (max + 10) > 100 ? 100 : max + 10; // add padding to end of bars

      _.forEach(bars, function ($bar, key) {
        if (datum[key]) {
          $('.' + key).show();
          $bar.width((datum[key] / max) * 100 + '%').children('.bar-value').text(roundToWhole(datum[key]) + '%');
        } else {
          $('.' + key).hide();
        }
      });
    }

    function renderCampus(datum) {
      $campus.text(datum.campus);
      drawBars(datum);
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
