/* global, d3 */

var ShotChart = (function () {
	'use strict';

	function ShotChart (id, url, sendHeight) {
		this.init = this.init.bind(this, id);
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
			return d3.shots().displayToolTips(true).displayType('scatter');
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
			// this.circles      = this.buildCircles();
			// this.segments     = this.buildSegments();
			// this.lines        = this.buildLines();
			// this.xAxis        = this.buildXAxis();
			// this.legend       = this.buildLegend();
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
			return d3.scaleLinear().domain([-50,50]).range([47,0]);
		},

		mapShotData: function (shot) {
			var xShotScale = this.xShotScale;
			var yShotScale = this.yShotScale;
			console.log(shot.YCoord);
			return {
				x: xShotScale(shot.XCoord),
				y: yShotScale(shot.YCoord),
				shotType: shot.ShotType,
				shot_distance: shot.ShotDistance,
				playerName: shot.PlayerName,
				playerID: shot.PlayerID,
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
			//this.height     = this.setHeight();
			this.xShotScale = this.setXShotScale();
			this.yShotScale = this.setYShotScale();
			this.data       = this.parseData(data);
			console.log(this.data);
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