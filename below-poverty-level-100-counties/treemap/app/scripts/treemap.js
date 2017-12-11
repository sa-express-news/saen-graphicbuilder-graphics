/* global, d3 */

var TreeMap = (function () {
  'use strict';

  var colorArr = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5'];

  function TreeBuilder (id, url) {
    this.init = this.init.bind(this, id);
    this.getData(url, this.init);
  }

  TreeBuilder.prototype = {
    /*
     * DOM builder functions
     */

    buildSVG: function (id) {
      return d3.select(id).append('svg')
          .attr('width', this.width)
          .attr('height', this.height);
    },

    buildCell: function () {
      return this.svg.selectAll("g")
          .data(this.treeRoot.leaves())
        .enter().append("g")
          .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });
    },

    buildBlocks: function () {
      var that = this;
      return this.cell.append("rect")
          .attr("id", function(d) { return d.data.state; })
          .attr("width", function(d) { return d.x1 - d.x0; })
          .attr("height", function(d) { return d.y1 - d.y0; })
          .attr("fill", function(d) { return that.color(d.parent.data.name); });
    },

    addClipPath: function () {
      return this.cell.append("clipPath")
          .attr("id", function(d) { return "clip-" + d.data.state; })
        .append("use")
          .attr("xlink:href", function(d) { return "#" + d.data.state; });
    },

    addText: function () {
      return this.cell.append("text")
          .attr("clip-path", function(d) { return "url(#clip-" + d.data.state + ")"; })
        .selectAll("tspan")
          .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
          .attr("x", 4)
          .attr("y", function(d, i) { return 13 + i * 10; })
          .text(function(d) { return d; });
    },

    /*
     * util functions
     */

    buildTreemap: function () {
      return this.treemapGenerator(this.treeRoot);
    },

    buildRoot: function () {
      return d3.hierarchy(this.data)
          .sum(function (d) { return d.value; })
          .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    },

    setTreemapGenerator: function () {
      return d3.treemap()
        .size([this.width, this.height])
        .round(true)
        .paddingInner(1);
    },

    mapToHierarchy: function (data) {
      var output = { name: 'counties', children: [] };
      data.forEach(function (county) {
        var curr = {
          name: county.key,
          children: county.values,
        };
        output.children.push(curr);
      });
      return output;
    },

    nestData: function (data) {
      return d3.nest()
          .key(function(d) { return d.state; })
          .entries(data);
    },

    setColor: function () {
      return d3.scaleOrdinal().range(colorArr);
    },

    setHeight: function () {
      return Math.round(this.width * 0.75);
    },

    setWidth: function () {
      return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth);
    },

    /*
     * generate the DOM elements
     */

    buildChart: function (id) {
      this.svg      = this.buildSVG(id);
      this.cell     = this.buildCell();
      this.blocks   = this.buildBlocks();
      this.clipPath = this.addClipPath();
      this.text     = this.addText();
    },

    /* 
     * initalize chart in callback
     */

    init: function (id, data) {
      this.width              = this.setWidth();
      this.height             = this.setHeight();
      this.color              = this.setColor();
      this.data               = this.mapToHierarchy(this.nestData(data));
      this.treemapGenerator   = this.setTreemapGenerator();
      this.treeRoot           = this.buildRoot();
      this.treemap            = this.buildTreemap();

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

  return TreeBuilder;
}());