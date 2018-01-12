/* global, d3 */

var buildLineChart = function (el, dataPath, sendHeight) {
	'use strict';

	function LineChart (el, data, sendHeight) {
		this.data 	= data;
		this.width 	= this.setWidth();
		this.height = this.setHeight();
		this.svg 	= this.buildSVG(el);
		this.lines	= this.setLines();
		this.scales	= this.setScales();
	}

	LineChart.prototype = {
		margin: {top: 20, right: 80, bottom: 30, left: 50},

		setWidth: function () {
			return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth);
		},

		setHeight: function () {
			return Math.round(this.width * 0.75);
		},

		buildSVG: function (el) {
			return d3.select(el).append('svg')
						.attr('width', this.width)
						.attr('height', this.height)
					.append('g')
						.attr('transform', 'translate(' + this.margin.left + "," + this.margin.top + ')');
		},

		setLines: function () {
			var lineTypes = [
				{
					name: 'stableAverage',
					type: 'curveBasis',
					color: 'blue',
					opacity: 1,
				},
				{
					name: 'stable',
					type: 'curveLinear',
					color: 'blue',
					opacity: 0.5, 
				},
				{
					name: 'unstable',
					type: 'curveLinear',
					color: 'green', 
				},
			];

			return lineTypes.reduce(function (res, config) {
				var lineHash = {};
				lineHash.line = d3.line()
									.curve(d3[config.type])
									.x(function (d) { return d.month; })
									.y(function (d) { return d.rate; });
				
				lineHash.styles = {
					color: config.color,
					opacity: config.opacity,
				};

				res[config.name] = lineHash;
				return res;
			}, {});
		},

		setScales: function () {
			// more compicated than this. I need to calculate for all the three options.
			return {
				x: d3.scaleOrdinal().domain(this.data.map(function(d) { return d.month; })).rangeRoundBands([0, this.width]),
				y: d3.scaleLinear().domain([
						d3.min(this.data, function(y) { return d3.min(y.values, function(d) { return d.rate; }); }),
    					d3.max(this.data, function(y) { return d3.max(y.values, function(d) { return d.rate; }); })
					]).range([this.height, 0]),
			};
		},
	};

	function getData (el, dataPath, sendHeight) {
		d3.json(dataPath, function (data) {
			return new LineChart(el, data, sendHeight);
		});
	}

	return getData(el, dataPath, sendHeight);

};
