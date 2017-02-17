/* global d3 */

var LineChart = (function (chart) {
  'use strict';
  var defaults = { // default values for new line chart
    dataUrl: null,
    id: null,
    marginTop: 45, 
    marginRight: 120, 
    marginBottom: 50, 
    marginLeft: 28,
    numXAxisTicks: 5,
    numYAxisTicks: 5,
    leadingYAxisSymbol: '',
    followingYAxisSymbol: '',
    tooltipMargin: '-28px',
  };

  function LineChart(config) {
    var specs = Object.assign({}, defaults, config);
    this.margin = { top: specs.marginTop, bottom: specs.marginBottom, left: specs.marginLeft, right: specs.marginRight, };
    this.numXAxisTicks = specs.numXAxisTicks;
    this.numYAxisTicks = specs.numYAxisTicks;
    this.leadingYAxisSymbol = specs.leadingYAxisSymbol;
    this.followingYAxisSymbol = specs.followingYAxisSymbol;
    this.tooltipMargin = specs.tooltipMargin;
    this.id = specs.id;
    this.dataUrl = specs.dataUrl;

    this.setWidthHeight();

    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);

    this.svg = this.makeSvg('#' + this.id);
    this.voronoi = this.buildMouseEventOverlay();

    this.tooltips = []; // will be populated with tooltip data for each line
    this.legend = []; // will be populated with legend data for each line
  }

  LineChart.prototype = {
    init: function (callback) {
      // get the data, do everything else to build chart in the callback
      var that = this;
      d3.json(this.dataUrl, function(error, data) {
        // add lines and chart's x and y linearScale domains in callback func param
        callback(data, that);

        //that.addAxis();
        that.focus = that.addFocus(); // focus is the mouseover event point on chart
        that.addMouseEvents(); // the events that move this.focus and show the tooltips
      });
    },

    setWidthHeight: function () {
      // Set the dimensions of the canvas / graph
      var windowWidth;
      if(window.innerWidth > 620) {
        windowWidth =  620;
      } else {
        windowWidth = window.innerWidth;
      }

      this.width = windowWidth - this.margin.left - this.margin.right;
      this.height = 300 - this.margin.top - this.margin.bottom;
    },

    makeSvg: function (id) {
      // the base SVG chart will be built upon
      return d3.select(id)
        .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
            .attr('transform',
                  'translate(' + this.margin.left + ',' + this.margin.top + ')');
    },

    buildLineGenerator: function (xProp, yProp) {
      // for each line, pass in the correct x & y calues
      var that = this;
      return d3.line()
        .x(function(d) { return that.x(d[xProp]); })
        .y(function(d) { return that.y(d[yProp]); });
    },

    buildMouseEventOverlay: function () {
      // use voronoi diagram to manage data and position for mouse events
      var that = this;
      return d3.voronoi()
        .x(function(d) { 
          return that.x(d.x); 
        })
        .y(function(d) { 
          return that.y(d.y); 
        })
        .extent([[-that.margin.left, -that.margin.top], [that.width + that.margin.right, that.height + that.margin.bottom]]);
    },

    addNewLine: function (config) {
      // Add new line to chart (this method should be called as many times as necessary in this.init's callback)
      var lineGenerator = this.buildLineGenerator(config.xAxis, config.yAxis);
      this.svg.append('path')
          .attr('class', config.yAxis)
          .attr('d', lineGenerator(config.data));

      // Add legend text
      this.legend.push({
        class: config.yAxis,
        text: config.legendTxt,
      });

      // Add data for tooltip
      config.data.forEach(function (d) {
        this.tooltips.push({
          x: d[config.xAxis],
          y: d[config.yAxis],
          key: config.yAxis,
        });
      }, this);

      // Add label to end of line, lastNode points to the last data point
      var lastNode = config.data[config.data.length - 1][config.yAxis];
      this.addLineLabels(lastNode, config.legendTxt, config.yAxis);
    },

    addLegend: function () {
      // Add the Legend
      var legendSpace = this.width / this.legend.length;
      this.legend.forEach(function (node, idx) {
        this.svg.append('text')
            .attr('x', (legendSpace / 2) + idx * legendSpace)
            .attr('y', (this.margin.top / 2) * -1)
            .attr('class', 'legend ' + node.class)
            .text(node.text);
      }, this);
    },

    addAxis: function () {
      var that = this,
          formatNumbers = d3.format(',');

      var xAxis = d3.axisBottom()
          .scale(this.x)
          .ticks(that.numXAxisTicks)
          .tickFormat(d3.format('d'));

      var yAxis = d3.axisLeft()
          .scale(this.y)
          .ticks(that.numYAxisTicks)
          .tickSize(-this.width)
          .tickFormat(function(d) {
            return that.leadingYAxisSymbol + formatNumbers(d) + that.followingYAxisSymbol;
          });

      this.svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(xAxis);

      this.svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .selectAll('text')
            .attr('text-anchor', 'start')
            .attr('x', -(that.margin.left - 5))
            .attr('dy', -0.5);

      this.svg.append('g')
          .attr('class', 'y axis label')
          .selectAll('text')
            .attr('text-anchor', 'end')
            .attr('dy', 10);
    },

    addFocus: function () {
      // focus is the mouseover event point on the chart
      if (this.tooltips.length === 0) { return null; }
      var that = this;

      var focus = this.svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(-100,-100)');

      focus.append('circle')
        .attr('r', 4.5);

      focus.append('circle')
          .attr('r', 4);

      focus.append('rect')
        .attr('x', -30)
        .attr('y', -45)
        .attr('width', '60px')
        .attr('height', '40px');

      focus.append('text')
          .attr('x', 10)
          .attr('class', that.id + '-yText yText')
          .attr('dy', '-12px')
          .attr('dx', that.tooltipMargin);

      focus.append('text')
        .attr('class', that.id + '-xText xText')
        .attr('x', 10)
        .attr('dy', '-30px')
        .attr('dx', '-25px');

      return focus;
    },

    addLineLabels: function (lastNode, legendTxt, yAxis) {
      this.svg.append("text")
        .attr('class', yAxis)
        .attr("transform", "translate(" + (this.width+3) + "," + this.y(lastNode) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .text(legendTxt);
    },

    addMouseEvents: function () {
      if (this.tooltips.length === 0) { return; }
      var that = this;

      var voronoiGroup = this.svg.append('g')
        .attr('class', 'voronoi');
        
      voronoiGroup.selectAll('path')
        .data(that.voronoi.polygons(that.tooltips))
        .enter().append('path')
        .attr('d', function(d) { return 'M' + d.join('L') + 'Z'; })
        .on('mouseover', function (d) { that.mouseover(d, that); })
        .on('mouseout', function (d) { that.mouseout(d, that); });
    },

    mouseover: function (d, ctx) {
      var data = d.data,
          numberFormat = d3.format(',');
      ctx.focus.attr('transform', 'translate(' + ctx.x(data.x) + ',' + ctx.y(data.y) + ')');
      ctx.focus
        .select('.' + ctx.id + '-yText')
        .attr('class', ctx.id + '-yText yText ' + data.key)
        .text(ctx.leadingYAxisSymbol + numberFormat(data.y) + ctx.followingYAxisSymbol);
      ctx.focus.select('.' + ctx.id + '-xText').text(data.x);
    },

    mouseout: function (d, ctx) {
      ctx.focus.attr('transform', 'translate(-100,-100)');
      ctx.focus.select('.' + ctx.id + '-yText').attr('class', ctx.id + '-yText yText');
    },
  };

  chart.buildChart = function (configChart, callback) {
    var lineChart = new LineChart(configChart);
    lineChart.init(callback);
  };

  return chart;

}(LineChart || {}));
