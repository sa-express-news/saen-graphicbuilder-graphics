/* global, d3 */

var RadialBarChart = (function () {
  'use strict';

  var colorArr = ['#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f', '#1f78b4','#b15928','#8dd3c7'];

  function BuildChart (id, url) {
    this.init = this.init.bind(this, id);
    this.getData(url, this.init);
  }

  BuildChart.prototype = {
    /*
     * buildChart functions
     */

    buildLegend: function () {
      var that = this;
      var states = ['1', '2', '4', '5', '13', '21', '22', '28', '30', '35', '38', '46', '48', '54'];
      var yOffset = this.width < 720 ? -0.6 : -0.45;
      var legend = this.svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (this.width * -0.4) + ',' + (this.height * yOffset) + ')');

      legend.selectAll('circle')
          .data(states)
        .enter().append('circle')
          .attr('cy', function (d,i) {
            return that.width < 720 ? (i + 1) * 20 + 20 : (i + 1) * 30 + 20;
          })
          .attr('r', 6)
          .attr('cx', 6)
          .style('stroke', 'black')
          .attr('class', 'legendMarker')
          .style('fill', function (d) {
              return that.utils.color(that.utils.mapStates(d));
          });

      legend.selectAll('.desc')
          .data(states)
        .enter().append('text')
          .attr('y', function (d,i) { 
            return that.width < 720 ? (i + 1) * 20 + 24 : (i + 1) * 30 + 24;
          })
          .attr('x', 20)
          .attr('class', 'desc')
          .text(function (d) { return that.utils.mapStates(d); });
      return legend;
    },

    buildXAxis: function () {
      return this.svg.append('g')
        .attr('class', 'x axis')
        .call(this.utils.xAxisCB);
    },

    buildLines: function () {
      var that = this;
      return this.svg.selectAll('line')
          .data(this.utils.keys)
        .enter().append('line')
          .attr('y2', -this.barHeight - 20)
          .style('stroke', 'black')
          .style('opacity', 0.5)
          .style('stroke-width','.5px')
          .attr('transform', function(d, i) { return 'rotate(' + (i * 360 / that.utils.numBars) + ')'; });
    },

    buildSegments: function () {
      var that = this;
      var segments = this.svg.selectAll('path')
          .data(this.data)
        .enter().append('path')
          .each(function(d) { d.outerRadius = 0; })
          .style('fill', function (d) { return that.utils.color(that.utils.mapStates(d.state)); })
          .attr('d', this.utils.arc);

      // set segment animations
      segments.transition().ease(d3.easeElastic).duration(1000).delay(function(d,i) {return (25-i) * 100;})
          .attrTween("d", function(d,index) {
            var i = d3.interpolate(d.outerRadius, that.utils.barScale(+d.percent));
            return function(t) { d.outerRadius = i(t); return that.utils.arc(d,index); };
          });

      return segments;
    },

    buildCircles: function () {
      var that = this;
      return this.svg.selectAll('circle')
          .data(this.utils.x.ticks(3))
        .enter().append('circle')
          .attr('r', function(d) {return that.utils.barScale(d);})
          .style('fill', 'none')
          .style('stroke', 'black')
          .style('stroke-dasharray', '2,2')
          .style('stroke-width','.5px');
    },

    buildSVG: function (id) {
      return d3.select(id).append('svg')
          .attr('width', this.width)
          .attr('height', this.height)
        .append('g')
          .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
    },

    /* 
     * buildChartUtils functions
     */

    setLabelRadius: function () {
      return this.barHeight * 1.025
    },

    setArc: function (numBars) {
      return d3.arc()
          .startAngle(function(d,i) { return (i * 2 * Math.PI) / numBars; })
          .endAngle(function(d,i) { return ((i + 1) * 2 * Math.PI) / numBars; })
          .innerRadius(0);
    },

    setXAxisCB: function (x) {
      return d3.axisLeft()
          .scale(x)
          .ticks(3)
          .tickFormat(function (d) { return d + '%'; });
    },

    setBarScale: function (extent) {
      return d3.scaleLinear()
          .domain(extent)
          .range([0, this.barHeight]);
    },

    setMapStates: function () {
      var stateMap = {
        '1': 'AL',
        '2': 'AK',
        '4': 'AZ',
        '5': 'AR',
        '13': 'GA',
        '21': 'KY',
        '22': 'LA',
        '28': 'MS',
        '30': 'MT',
        '35': 'NM',
        '38': 'ND',
        '46': 'SD',
        '48': 'TX',
        '54': 'WV',
      };
      return function (fips) {
        return stateMap[fips] ? stateMap[fips] : fips;
      }
    },

    setColor: function () {
      return d3.scaleOrdinal().range(colorArr);
    },

    setKeys: function (mapStates) {
      return this.data.map(function(d,i) { return mapStates(d.state); });
    },

    setX: function (extent) {
      return d3.scaleLinear()
          .domain(extent)
          .range([0, -this.barHeight]);
    },

    setExtent: function () { 
      return d3.extent(this.data, function(d) { return d.percent; });
    },

    /*
     * initialization functions
     */

    buildChart: function (id) {
      this.svg          = this.buildSVG(id);
      this.circles      = this.buildCircles();
      this.segments     = this.buildSegments();
      this.lines        = this.buildLines();
      this.xAxis        = this.buildXAxis();
      this.legend       = this.buildLegend();
    },

    buildChartUtils: function () {
      var extent      = this.setExtent();
      var x           = this.setX(extent);
      var mapStates   = this.setMapStates();
      var keys        = this.setKeys(mapStates);
      return {
        extent     : extent,
        x          : x,
        keys       : keys,
        numBars    : keys.length,
        color      : this.setColor(),
        mapStates  : mapStates,
        barScale   : this.setBarScale(extent),
        xAxisCB    : this.setXAxisCB(x),
        arc        : this.setArc(keys.length),
        labelRadius: this.setLabelRadius(),
      };
    },

    setData: function (data) {
      return data.sort(function(a, b) { return b.percent - a.percent; });
    },

    setBarHeight: function () {
      return this.height / 2 - 20;
    },

    setHeight: function () {
      return Math.round(this.width * 0.75);
    },

    setWidth: function () {
      return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth);
    },

    /* 
     * initalize chart in callback
     */

    init: function (id, data) {
      this.width      = this.setWidth();
      this.height     = this.setHeight();
      this.barHeight  = this.setBarHeight();
      this.data       = this.setData(data);
      this.utils      = this.buildChartUtils();
      
      this.buildChart(id);
    },

    /*
     * get data from csv
     */

    getData: function (url, callback) {
      d3.csv(url, function(error, data) {
        if (error) return console.error(error);
        callback(data);
      });
    },
  };

  return BuildChart;
}());