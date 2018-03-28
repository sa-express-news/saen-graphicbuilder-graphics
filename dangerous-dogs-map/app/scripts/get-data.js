/* global d3 */

var DogMap = (function (maps) {
  'use strict';

  maps.getData = function (cb) {
    var that = this;
    d3.json('assets/geoDogs.geojson', function (error, data) {
      if (error) {
        return console.error(error);
      } else {
        cb(data);
      }
    });
  };

  return maps;

}(DogMap || {}));