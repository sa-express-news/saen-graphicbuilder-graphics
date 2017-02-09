/* global d3, topojson */

var VaccinationMap = (function (map) {
  'use strict';

  map.toGeoJSON = function (topoObj, obj) {
    return topojson.feature(topoObj, obj);
  };

  map.getData = function (cb) {
    var that = this,
        loader = d3.select('.loader');
    loader.style('display', 'inline-block')
    d3.json('assets/exemptionsTopo.json', function (error, data) {
      loader.style('display', 'none')
      if (error) {
        return console.error(error);
      } else {
        var shapes = that.toGeoJSON(data, data.objects.allData);
        cb(shapes);
      }
    });
  };

  return map;

}(VaccinationMap || {}));