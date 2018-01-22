/* global, d3 */

var buildLineChart = function (el, dataPath, sendHeight) {
	'use strict';

	function LineChart (el, data, sendHeight) {
		this.data 	= data;
		this.width 	= this.setWidth();
		this.height = this.setHeight();
		this.scales	= this.setScales();
		this.line	= this.setLine();

		// build chart
		this.svg 	= this.buildSVG(el);
		this.g 		= this.addMainGroup();
		this.xAxis	= this.addXAxis();
		this.yAxis	= this.addYAxis();

		// add data to chart
		this.regions = this.addRegions();
		this.displayRegions();
		this.displayLegend();
		
		sendHeight();
	}

	LineChart.prototype = {
		margin: {top: 20, right: 5, bottom: 30, left: 60},

		setWidth: function () {
			return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth) - this.margin.left - this.margin.right;
		},

		setHeight: function () {
			return Math.round(this.width * 0.75) - this.margin.top - this.margin.bottom;
		},

		setOrdinalRange: function () {
			var incr 	= this.width / this.data[0].values.length,
				res 	= new Array(this.data[0].values.length);
			for (var i = 0; i < res.length; i++) {
				res[i] = i * incr;
			}
			return res;
		},

		setScales: function () {
			return {
				x: d3.scaleOrdinal(this.setOrdinalRange()).domain(this.data[0].values.map(function(d) { return d.year; })),
				y: d3.scaleLinear().domain([
						d3.min(this.data, function(y) { return d3.min(y.values, function(d) { return d.val; }); }),
    					d3.max(this.data, function(y) { return d3.max(y.values, function(d) { return d.val; }); })
					]).range([this.height, 0]),
				z: d3.scaleOrdinal(['#9ecae1','#3182bd'])
						.domain(['Mexico', 'Not Mexico']),
			};
		},

		setLine: function () {
			var that = this;
			return d3.line()
						.curve(d3.curveLinear)
						.x(function (d) { return that.scales.x(d.year); })
						.y(function (d) { return that.scales.y(d.val); });
		},

		// build chart

		buildSVG: function (el) {
			return d3.select(el).append('svg')
						.attr('width', this.width + this.margin.left + this.margin.right)
						.attr('height', this.height + this.margin.top + this.margin.bottom);
		},

		addMainGroup: function () {
			return this.svg.append('g')
						.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
		},

		addXAxis: function () {
			return this.g.append('g')
							.attr('class', 'axis axis--x')
							.attr('transform', 'translate(0,' + this.height + ')')
							.call(d3.axisBottom(this.scales.x));
		},

		addYAxis: function () {
			return this.g.append('g')
							.attr('class', 'axis axis--y')
							.call(d3.axisLeft(this.scales.y).tickFormat(function (d) { 
								return parseInt(d, 10).toLocaleString(); 
							}).tickSizeOuter(0))
						.append('text')
							.attr('transform', 'rotate(-90)')
							.attr('y', 6)
							.attr('x', -100)
							.attr('dy', '0.71em')
							.attr('fill', '#000')
							.text('Rate of change (%)');
		},

		addGroup: function (group, name) {
			return this.g.selectAll('.' + name)
							.data(group.reverse())
							.enter().append('g')
								.attr('class', name);
		},

		addRegions: function () {
			return this.g.selectAll('.region')
							.data(this.data)
							.enter().append('g')
								.attr('class', 'region');
		},

		displayRegions: function () {
			var that = this;
			this.regions.append('path')
					.attr('class', 'line')
					.attr('d', function (d) { return that.line(d.values); })
					.style('stroke', function (d) { return that.scales.z(d.region); })
					.style('stroke-opacity', 1)
					.style('stroke-width', 2.5);
		},

		getLegendConfig: function () {
			var isMobile = this.width < 500;
			return {
				position: {
					x: isMobile ? this.width * 0.85 : this.width * 0.15,
					y: isMobile ? 10 : 4,
				},
				circle: {
					cy: function (d, i) {
						return isMobile ? (i + 1) * 13 : (i + 1) * 20;
					},
					r: isMobile ? 4 : 6,
					cx: isMobile ? 4 : 6,
				},
				label: {
					y: function (d, i) {
						return isMobile ? (i + 1) * 13 + 4 : (i + 1) * 20 + 4;
					},
					x: isMobile ? 15 : 20,
				},
			};
		},

		displayLegend: function () {
			var that 	= this;
			var config 	= this.getLegendConfig();

			var legend = this.svg.append('g')
					.attr('class', 'legend')
					.attr('transform', 'translate(' + config.position.x + ',' + config.position.y + ')');

			legend.selectAll('circle')
				.data(this.data)
				.enter().append('circle')
					.attr('cy', config.circle.cy)
					.attr('r', config.circle.r)
					.attr('cx', config.circle.cx)
					.style('stroke', 'black')
					.attr('class', 'legendMarker')
					.style('fill', function (d) {
						return that.scales.z(d.region);
					});

			legend.selectAll('.desc')
				.data(this.data)
				.enter().append('text')
					.attr('y', config.label.y)
					.attr('x', config.label.x)
					.attr('class', 'desc')
					.style('font-size', '0.6em')
					.text(function (d) { return d.region; });
			return legend;
		},
	};

	function getData (el, dataPath, sendHeight) {
		d3.json(dataPath, function (data) {
			return new LineChart(el, data, sendHeight);
		});
	}

	return getData(el, dataPath, sendHeight);

};
