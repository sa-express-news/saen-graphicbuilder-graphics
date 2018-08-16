/* global d3 */

var SchoolSearch = (function (charts) {
  'use strict';

  charts.getData = function (cb) {
    var that = this;
    d3.json('assets/campus-results.json').then(function (data, error) {
      if (error) {
        return console.error(error);
      } else {
        cb(data);
      }
    });
  };

  return charts;

}(SchoolSearch || {}));