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

    var districts = {
        "LACKLAND ISD": 91,
        "FT SAM HOUSTON ISD": 92,
        "RANDOLPH FIELD ISD": 94,
        "SOUTHSIDE ISD": 73,
        "SOMERSET ISD": 79,
        "EAST CENTRAL ISD": 70,
        "SOUTHWEST ISD": 71,
        "HARLANDALE ISD": 76,
        "SOUTH SAN ANTONIO ISD": 64,
        "SAN ANTONIO ISD": 74,
        "ALAMO HEIGHTS ISD": 89,
        "NORTH EAST ISD": 85,
        "JUDSON ISD": 72,
        "BOERNE ISD": 92,
        "SCHERTZ-CIBOLO-U CITY ISD": 87,
        "EDGEWOOD ISD": 63,
        "NORTHSIDE ISD": 84,
    };

    function properNounCasing (str) {
        if (str && typeof str === 'string') {
            var lower = str.toLowerCase();
            return lower.split(' ').map(word => {
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

    function drawMeta (datum) {
        $('span#ecodis').text(datum.percent_econ_disadv);
        if (!datum.is_district && districts[datum.distname]) {
            $('span#district').text(properNounCasing(datum.distname));
            $('li#district-score span#score').text(districts[datum.distname]);
            $('li#district-score').show();
        } else {
            $('li#district-score').hide();
        }
    }

    function populateTemplate (datum) {
      drawMeta(datum);
      charts.drawDonuts(datum);
    }

    function renderCampus(datum) {
      $('#name').text(properNounCasing(datum.campus));
      populateTemplate(datum);
    }

    renderCampus(campusDefault);

    var searchSchools = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      prefetch: {
        url: 'assets/campus-results.json'
      },
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
        return obj.name;
      },
      source: searchSchools.ttAdapter()
    });

    charts.$schoolSearchInit = function (pymChild) {
        $schoolSearch.on('typeahead:selected', function(e, datum) {
          e.stopPropagation();
          renderCampus(datum);
          pymChild.sendHeight();
        });
    }

    return charts;
}(SchoolSearch || {}));