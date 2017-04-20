/* global pym, $, Bloodhound, _ */

(function() {
  'use strict';

  var pymChild, $billSearch;

  function render() {
    var $district = $('#district'),
        bars = {
          fifthGradeReading2017: $('span#fifthGradeReading2017'),
          fifthGradeReading2016: $('span#fifthGradeReading2016'),
          fifthGradeReading2015: $('span#fifthGradeReading2015'),
          fifthGradeMath2017: $('span#fifthGradeMath2017'),
          fifthGradeMath2016: $('span#fifthGradeMath2016'),
          eigthGradeReading2017: $('span#eigthGradeReading2017'),
          eigthGradeReading2016: $('span#eigthGradeReading2016'),
          eigthGradeReading2015: $('span#eigthGradeReading2015'),
          eigthGradeMath2017: $('span#eigthGradeMath2017'),
          eigthGradeMath2016: $('span#eigthGradeMath2016'),
        };

    var districtDefault = {
      district: 'Alamo Heights',
      fifthGradeReading2017: 85,
      fifthGradeReading2016: 90,
      fifthGradeReading2015: 92,
      fifthGradeMath2017: 87,
      fifthGradeMath2016: 89,
      eigthGradeReading2017: 88,
      eigthGradeReading2016: 92,
      eigthGradeReading2015: 94,
      eigthGradeMath2017: 89,
      eigthGradeMath2016: 86,
    };

    function drawBars (datum) {
      var max = _.reduce(bars, function (max, val, key) { 
        return datum[key] > max ? datum[key] : max; 
      }, 0);

      max = (max + 10) > 100 ? 100 : max + 10; // add padding to end of bars

      _.forEach(bars, function ($bar, key) {
        if (datum[key]) {
          $('.' + key).show();
          $bar.width((datum[key] / max) * 100 + '%').children('.bar-value').text(datum[key] + '%');
        } else {
          $('.' + key).hide();
        }
      });
    }

    function renderDistrict(datum) {
      $district.text(datum.district);
      drawBars(datum);
    }

    renderDistrict(districtDefault);

    var searchDistricts = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('district'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'assets/district-results.json'
      },
      ttl: 3600000 // One hour
    });

    searchDistricts.initialize();

    $billSearch = $('#search').typeahead({
      autoselect: true,
      hint: false,
      highlight: false,
      minLength: 2,
    }, {
      name: 'staar',
      limit: 50,
      displayKey: function(obj) {
        return obj.district;
      },
      source: searchDistricts.ttAdapter()
    });

    $billSearch.on('typeahead:selected', function(e, datum) {
      e.stopPropagation();
      renderDistrict(datum);
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
