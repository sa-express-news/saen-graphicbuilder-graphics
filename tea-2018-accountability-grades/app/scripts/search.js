var SchoolSearch = (function (charts) {
    var campusDefault = {
      distname: "ALAMO HEIGHTS ISD",
      name: "ALAMO HEIGHTS H S",
      cntyname: "BEXAR",
      grdspan: "09 - 12",
      percent_econ_disadv: 17.7,
      overall_rating: "Met Standard",
      overall_scaled_score: 87,
      student_achievement_rating: "Met Standard",
      student_achievement_score: 91,
      school_progress_academic_growth_rating: "Met Standard",
      school_progress_academic_growth_score: 66,
      school_progress_relative_performance_rating: "Met Standard",
      school_progress_relative_performance_score: 76,
      closing_gaps_rating: "Met Standard",
      closing_gaps_score: 77,
      is_district: false
    };

    var districts = {"BOERNE ISD":{"rating":"A","score":92},"COMFORT ISD":{"rating":"B","score":84},"DEVINE ISD":{"rating":"B","score":81},"D'HANIS ISD":{"rating":"B","score":88},"NATALIA ISD":{"rating":"F","score":59},"HONDO ISD":{"rating":"C","score":75},"MEDINA VALLEY ISD":{"rating":"A","score":90},"NEW BRAUNFELS ISD":{"rating":"B","score":86},"COMAL ISD":{"rating":"B","score":89},"LACKLAND ISD":{"rating":"A","score":91},"FT SAM HOUSTON ISD":{"rating":"A","score":92},"RANDOLPH FIELD ISD":{"rating":"A","score":94},"SOUTHSIDE ISD":{"rating":"C","score":73},"SOMERSET ISD":{"rating":"C","score":79},"EAST CENTRAL ISD":{"rating":"C","score":70},"SOUTHWEST ISD":{"rating":"C","score":71},"HARLANDALE ISD":{"rating":"C","score":76},"SOUTH SAN ANTONIO ISD":{"rating":"D","score":64},"SAN ANTONIO ISD":{"rating":"C","score":74},"ALAMO HEIGHTS ISD":{"rating":"B","score":89},"NORTH EAST ISD":{"rating":"B","score":85},"JUDSON ISD":{"rating":"C","score":72},"SCHERTZ-CIBOLO-U CITY ISD":{"rating":"B","score":87},"EDGEWOOD ISD":{"rating":"D","score":63},"NORTHSIDE ISD":{"rating":"B","score":84}};

    function properNounCasing (str) {
        if (str && typeof str === 'string') {
            var lower = str.toLowerCase();
            return lower.split(' ').map(function (word) {
                if (/(^isd$|^hs$|^stem$|^jc$)/.test(word)) {
                    return word.toUpperCase();
                } else {
                    return word[0].toUpperCase() + word.substr(1);
                }
            }).join(' ');
        } else {
            return str;
        }
    }

    function drawDistrictMeta (datum) {
      $('span#district').text(properNounCasing(datum.name));
      $('span#score').text(districts[datum.name].score);
      $('span#rating').text(districts[datum.name].rating);
      $('li#district-score').hide();
      $('li#district-rating').show();
    }

    function drawCampusMeta (datum) {
      $('span#district').text(properNounCasing(datum.distname));
      $('span#score').text(districts[datum.distname].score);
      $('span#rating').text(districts[datum.distname].rating);
      $('li#district-score').show();
      $('li#district-rating').hide();
    }

    function drawMeta (datum) {
      $('span#ecodis').text(datum.percent_econ_disadv);
      if (datum.is_district && districts[datum.name]) {
        drawDistrictMeta(datum);
      } else if (districts[datum.distname]) {
        drawCampusMeta(datum);
      } else {
        $('li#district-score').hide();
        $('li#district-rating').hide();
      } 
    }

    function populateTemplate (datum) {
      drawMeta(datum);
      charts.drawDonuts(datum);
    }

    function renderCampus(datum) {
      $('span#name').text(properNounCasing(datum.name));
      populateTemplate(datum);
    }

    renderCampus(campusDefault);

    charts.$schoolSearchInit = function (data, sendHeight) {
        var searchSchools = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          local: data,
          ttl: 3600000 // One hour
        });

        searchSchools.initialize();

        $schoolSearch = $('#search').typeahead({
          autoselect: true,
          hint: false,
          highlight: false,
          minLength: 2,
        }, {
          name: 'accountability',
          limit: 50,
          displayKey: function(obj) {
            return properNounCasing(obj.name);
          },
          source: searchSchools.ttAdapter()
        });

        $schoolSearch.on('typeahead:selected', function(e, datum) {
          e.stopPropagation();
          renderCampus(datum);
          sendHeight();
        });
    };

    return charts;
}(SchoolSearch || {}));