/* global d3 */

var VaccinationMap = (function (map) {
  'use strict';

  function MapFactory(el, shapes) {
    this.container = d3.select('#' + el);
    if (this.container.empty()) { return; }
    this.width = this.getContainerWidth();

    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    this.projection = this.buildProjection(this);
    this.path = this.buildPath();
    this.bbox = this.buildBbox(shapes);

    this.render(shapes);
  }

  MapFactory.prototype = {
    getWindowWidth: function () {
      return window.innerWidth > 780 ? 780 : window.innerWidth;
    },

    getContainerWidth: function () {
      var paddingLeft  = parseFloat(this.container.style('padding-left')),
          paddingRight = parseFloat(this.container.style('padding-right')),
          width = this.getWindowWidth();

      return Math.round(width - paddingLeft - paddingRight);
    },

    getBoxWidth: function () {
      return this.bbox[2] - this.bbox[0];
    },

    getBoxHeight: function () {
      return this.bbox[3] - this.bbox[1];
    },

    getRatio: function () {
      return this.getBoxHeight() / this.getBoxWidth();
    },

    projectPoint: function (coordinates) {
      return [this.xScale(coordinates[0]), this.yScale(-coordinates[1])];
    },

    buildSVG: function () {
      this.height = Math.round(this.width * this.getRatio());

      return this.container.append('svg')
                  .attr('width', this.width)
                  .attr('height', this.height);
    },

    buildProjection: function (map) {
      return d3.geoTransform({
        point: function (px, py) {
          this.stream.point(map.xScale(px), map.yScale(-py));
        }
      });
    },

    buildPath: function () {
      return d3.geoPath().projection(this.projection).pointRadius(2);
    },

    buildBbox: function (shapes) {
      return this.path.bounds(shapes).reduce(function (a, b) { return a.concat(b); });
    },

    getColor: function (percent) {
      var num = parseFloat(percent),
          high = d3.color('#DC7860'),
          low = d3.color('#97D6DA');

      if (num > 2) {
        return high;
      } else if (num > 1.5) {
        high.opacity = 0.8;
        return high;
      } else if (num > 1) {
        high.opacity = 0.6;
        return high;
      } else if (num < 0.025) {
        low.opacity = 0.6;
        return low;
      } else if (num >= 0.01 && num < 0.025) {
        low.opacity = 0.8;
        return low;
      } else if (num < 0.01) {
        return low;
      } else {
        low.opacity = 0;
        return low;
      }
    },

    appendCounties: function (shapes) {
      var that = this;
      this.g.selectAll('path')
          .data(shapes.features)
          .enter()
            .append('path')
            .attr('d', this.path)
            .attr('class', 'county');
    },

    appendData: function (shapes) {
      var that = this;
      this.g.selectAll('county')
          .data(shapes.features)
          .enter()
            .append('path')
            .attr('d', this.path)
            .attr('class', 'overlay')
            .style('fill', function (d) {
              return that.getColor(d.properties['2015-2016']);
            })
            .append("title")
            .text(function(d) {
              return d.properties.COUNTY + ' County'
                  + "\nPercent of conscientious exemption students: " + d.properties['2015-2016'];
            });
    },

    render: function (shapes) {
      this.svg = this.buildSVG();
      this.g = this.svg.append('g');

      this.xScale.domain([this.bbox[0], this.bbox[2]]).range([0, this.width]);
      this.yScale.domain([this.bbox[3], this.bbox[1]]).range([this.height, 0]);

      this.appendCounties(shapes);

      this.appendData(shapes);
    }
  };
  
  map.buildMap = function (el, shapes) {
    return new MapFactory(el, shapes);
  };

  return map;

}(VaccinationMap || {}));