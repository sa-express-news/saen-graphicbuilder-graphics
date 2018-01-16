/* global, d3 */

var buildLineChart = function (el, dataPath, sendHeight) {
	'use strict';

	function LineChart (el, data, sendHeight) {
		this.data 	= data;
		this.width 	= this.setWidth();
		this.height = this.setHeight();
		this.scales	= this.setScales();
		this.lines	= this.setLines();

		// build chart
		this.svg 	= this.buildSVG(el);
		this.g 		= this.addMainGroup();
		this.xAxis	= this.addXAxis();
		this.yAxis	= this.addYAxis();

		// add data to chart
		this.years	= this.addYears(this.filterYears());
		this.displayYears();
		
		this.legend = this.addLegend();
	}

	LineChart.prototype = {
		margin: {top: 20, right: 80, bottom: 30, left: 50},

		setWidth: function () {
			return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth) - this.margin.left - this.margin.right;
		},

		setHeight: function () {
			return Math.round(this.width * 0.75) - this.margin.top - this.margin.bottom;
		},

		setOrdinalRange: function () {
			var incr 	= this.width / 12,
				res 	= new Array(12);
			for (var i = 0; i < res.length; i++) {
				res[i] = i * incr;
			}
			return res;
		},

		setScales: function () {
			return {
				x: d3.scaleOrdinal(this.setOrdinalRange()).domain(this.data[0].values.map(function(d) { return d.month; })),
				y: d3.scaleLinear().domain([
						d3.min(this.data, function(y) { return d3.min(y.values, function(d) { return d.rate; }); }),
    					d3.max(this.data, function(y) { return d3.max(y.values, function(d) { return d.rate; }); })
					]).range([this.height, 0]),
				z: d3.scaleOrdinal(['#a6cee3','#1f78b4','#b2df8a','#33a02c']).domain(['2014', '2015', '2016', '2017']),
			};
		},

		setLines: function () {
			var that = this;
			var lineTypes = [
				{
					name: 'stableAverage',
					type: 'curveLinear',
					color: function () { return '#fb9a99' },
					width: 2,
					opacity: 1,
				},
				{
					name: 'stable',
					type: 'curveLinear',
					color: function () { return '#fb9a99' },
					width: 0.6,
					opacity: 0.6, 
				},
				{
					name: 'unstable',
					type: 'curveLinear',
					width: 2,
					opacity: 1, 
					color: function (year) { return that.scales.z(year) }, 
				},
			];

			return lineTypes.reduce(function (res, config) {
				var lineHash 	= {};
				lineHash.line = d3.line()
									.curve(d3[config.type])
									.x(function (d) { return that.scales.x(d.month); })
									.y(function (d) { return that.scales.y(d.rate); });
				
				lineHash.styles = {
					color: config.color,
					opacity: config.opacity,
					width: config.width,
				};

				res[config.name] = lineHash;
				return res;
			}, {});
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
							.call(d3.axisLeft(this.scales.y).tickFormat(function (d) { return d * 100 + '%'; }).tickSizeOuter(0))
						.append('text')
							.attr('transform', 'rotate(-90)')
							.attr('y', 6)
							.attr('dy', '0.71em')
							.attr('fill', '#000')
							.text('Rate of change (%)');
		},
		
		filterYears: function () {
			var groupedYears = {
				stableAverage: [],
				stable: [],
				unstable: [],
			};
			return this.data.reduce(function (grouped, curr) {
				if (curr.year === '2000-2013') {
					grouped.stableAverage.push(curr);
				} else if (curr.year === '2014' || curr.year === '2015' || curr.year === '2016' || curr.year === '2017') {
					grouped.unstable.push(curr);
				} else {
					grouped.stable.push(curr);
				}
				return grouped;
			}, groupedYears);
		},

		addGroup: function (group, name) {
			return this.g.selectAll('.' + name)
							.data(group.reverse())
							.enter().append('g')
								.attr('class', name);
		},

		addYears: function (grouped) {
			var years = {};
			for(var group in grouped) {
				if (grouped.hasOwnProperty(group)) {
					years[group] = this.addGroup(grouped[group], group);
				}
			}
			return years;
		},

		displayGroup: function (group, name) {
			var that = this;
			group.append('path')
					.attr('class', 'line')
					.attr('d', function (d) { return that.lines[name].line(d.values); })
					.style('stroke', function (d) { return that.lines[name].styles.color(d.year); })
					.style('stroke-opacity', this.lines[name].styles.opacity)
					.style('stroke-width', this.lines[name].styles.width);

			if (name !== 'stable') {
				group.attr('data-legend',function(d) { return d.year});
			}
		},

		displayYears: function () {
			this.displayGroup(this.years.stable, 'stable');
			this.displayGroup(this.years.stableAverage, 'stableAverage');
			this.displayGroup(this.years.unstable, 'unstable');
		},

		addLegend: function () {
			this.svg.append('g')
					.attr('class','legend')
					.attr('transform','translate(50,30)')
					.style('font-size','12px')
					.call(d3.legend);
		},
	};

	function getData (el, dataPath, sendHeight) {
		d3.json(dataPath, function (data) {
			return new LineChart(el, data, sendHeight);
		});
	}

	return getData(el, dataPath, sendHeight);

};
