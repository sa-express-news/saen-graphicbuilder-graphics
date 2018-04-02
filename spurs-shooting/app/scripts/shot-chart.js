/* global, d3 */

var ShotChart = (function () {
	'use strict';

	var spursIds = ['parketo01', 'anderky01', 'leonaka01', 'greenda02', 'aldrila01', 'murrade01', 'forbebr01', 'bertada01', 'gayru01', 'whitede01', 'paulbr01', 'lauvejo01', 'gasolpa01', 'millspa02', 'ginobma01', 'hillida01', 'costema01'];

	function ShotChart (id, url, chartType, sendHeight) {
		this.init = this.init.bind(this, id);
		this.chartType 	= chartType;
		this.sendHeight = sendHeight;
		this.getData(url, this.init);
	}

	ShotChart.prototype = {
		buildSVG: function (id) {
			return d3.select(id);
		},

		buildCourt: function () {
			return d3.court().width(this.width);
		},

		buildShots: function () {
			return d3.shots().displayToolTips(true).displayType(this.chartType);
		},

		displayLegend: function () {
			var that = this;
			var offsetY = that.width < 500 ? 15 : 20;
			var legend = d3.select("svg").append('g')
				.attr('class', 'legend')
				.attr('transform', 'translate(0.1,' + (this.height * -0.025) + ')');

			legend.append('text')
				.attr('class', 'header')
				.attr('y', offsetY)
				.text('Shots attempted');

			legend.append('circle')
				.attr('cy', offsetY + 1.5)
				.attr('r', 0.5)
				.attr('cx', 0.6)
				.style('stroke', 'black');

			legend.append('text')
			  .attr('y', offsetY + 2)
			  .attr('x', 1.6)
			  .attr('class', 'desc')
			  .text('Made');

			legend.append('path')
				.attr("transform", "translate(0.6," + (offsetY + 3) + ") rotate(-45)")
				.attr("d", d3.symbol().type(d3.symbolCross).size(0.5));

			legend.append('text')
			  .attr('y', offsetY + 3.5)
			  .attr('x', 1.6)
			  .attr('class', 'desc')
			  .text('Missed');

			return legend;
		},

		/*
		 * initialization functions
		 */

		buildChart: function (id) {
			this.svg 	= this.buildSVG(id);
			this.court 	= this.buildCourt();
			this.shots	= this.buildShots();

			this.svg.call(this.court);
			this.svg.datum(this.data).call(this.shots);
			this.displayLegend();
		},

		setHeight: function () {
			return Math.round(this.width * 0.94);
		},

		setWidth: function () {
			return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth);
		},

		setXShotScale: function () {
			return d3.scaleLinear().domain([-240,240]).range([0,50]);
		},

		setYShotScale: function () {
			return d3.scaleLinear().domain([-50,400]).range([0,47]);
		},

		isShotMade: function (shotType) {
			return shotType.indexOf('x') === -1 ? 1 : 0;
		},

		isPlayerASpur: function (id) {
			return spursIds.indexOf(id) !== -1;
		},

		mapShotData: function (shot) {
			var x = this.xShotScale(shot.XCoord);
			var y = this.yShotScale(shot.YCoord);
			var isMade = this.isShotMade(shot.ShotType);
			var isSpur = this.isPlayerASpur(shot.PlayerID);
			return {
				x: x,
				y: y,
				shot_made_flag: isMade,
				shot_distance: parseInt(shot.ShotDistance, 10),
				action_type: shot.PlayerName,
				playerID: shot.PlayerID,
				isSpur: isSpur,
			};
		},

		parseData: function (data) {
			return data.map(this.mapShotData.bind(this));
		},

		/* 
		 * initalize chart in callback
     	 */

		init: function (id, data) {
			this.width      = this.setWidth();
			this.height 	= this.setHeight();
			this.xShotScale = this.setXShotScale();
			this.yShotScale = this.setYShotScale();
			this.data       = this.parseData(data);
			this.buildChart(id);
			this.sendHeight();
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

	return ShotChart;
}());