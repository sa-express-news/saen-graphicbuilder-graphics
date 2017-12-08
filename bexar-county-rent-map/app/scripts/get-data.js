/* global d3, topojson */

var RentMap = (function (maps) {
  'use strict';

  maps.toGeoJSON = function (topoObj, obj) {
    return topojson.feature(topoObj, obj);
  };

  maps.getData = function (cb) {
    var that = this;
    d3.json('assets/median-gross-rent.geojson', function (error, data) {
      if (error) {
        return console.error(error);
      } else {
        cb(data);
      }
    });
  };

  return maps;

}(RentMap || {}));