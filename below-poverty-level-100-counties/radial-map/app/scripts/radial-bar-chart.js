/* global, d3 */

var RadialBarChart = (function (chart) {
  'use strict';

  var colorArr = [
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd',
    '#ccebc5',
    '#ffed6f'
  ];

  function BuildChart (id, data) {
    this.data = this.sortData(data);
    this.color = this.setColors();
  }

  BuildChart.prototype = {
    sortData: function (data) {
      return data.sort(function(a, b) { return b.value - a.value; });
    },

    setColors: function () {
      return d3.scaleOrdinal().range(colorArr);
    },
  };
}(RadialBarChart || {}));