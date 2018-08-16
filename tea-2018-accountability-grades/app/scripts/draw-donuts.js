/* global, d3 */

var SchoolSearch = (function (charts) {
    var dataKeyMap = {
        overall: 'overall_scaled_score',
        achievement: 'student_achievement_score',
        growth: 'school_progress_academic_growth_score',
        relative: 'school_progress_relative_performance_score',
        gaps: 'closing_gaps_score',
    };

    function getGrade (score) {
        switch (true) {
            case (score > 89):
                return 'A';
            case (score > 79):
                return 'B';
            case (score > 69):
                return 'C';
            case (score > 59):
                return 'D';
            default:
                return 'F';
        }
    };

    function extractData (key, datum) {
        var dataKey = dataKeyMap[key];
        if (!datum[dataKey]) {
            return {
                score: 9999,
                grade: 'E'
            };
        } else {
            return {
                score: datum[dataKey],
                grade: getGrade(datum[dataKey]),
            };
        }
    }

    function getEmptySpace (data) {
        return {
            grade: 'E',
            score: 100 - data.score,
        }
    }

    function DrawDonut(el, data) {
        this.data       = data;
        this.width      = this.getWidth(el);
        this.height     = this.getHeight();
        this.radius     = this.getRadius();
        this.arc        = this.getArc();
        this.pie        = this.getPie();
        this.svg        = this.getSvg(el);

        this.init();
    }

    DrawDonut.prototype = {
        getWidth: function (el) {
            var divider = el === 'overall' || window.innerWidth <= 480 ? 1 : 2;
            var parentW = document.querySelector('div.charts').offsetWidth;
            return parentW > 720 ? (720 / divider) : (parentW / divider);
        },

        getHeight: function () {
            return Math.round(this.width * 0.4);
        },

        getRadius: function () {
            return Math.min(this.width, this.height) / 2;
        },

        getColor: function (grade) {
            ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99']
            var map = {
                A: '#4575b4',
                B: '#91bfdb',
                C: '#fee090',
                D: '#fc8d59',
                F: '#d73027',
                E: '#ffffff',
            };

            return map[grade];
        },

        getArc: function () {
            return d3.arc().outerRadius(this.radius - 10).innerRadius(this.radius - (this.radius * .3));
        },

        getPie: function () {
            return d3.pie().sort(null).value(function(d) { return d.score === 9999 ? 100 : d.score; });
        },

        getSvg: function (el) {
            return d3.select('#' + el + ' div.chart').append('svg')
                        .attr('width', this.width)
                        .attr('height', this.height).append('g')
                        .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
        },

        init: function () {
            var that = this;
            var g = this.svg.selectAll('.arc')
                        .data(this.pie(this.data))
                    .enter().append('g')
                        .attr('class', 'arc');

            g.append('path')
                .attr('d', this.arc)
                .style('fill', function(d) { return that.getColor(d.data.grade); })
                .style('stroke', function (d) { return d.data.grade !== 'E' ? 'rgba(51,51,51,0.6)' : '#FFF'; })

            g.append('text')
                .text(function(d) { 
                    if (d.data.grade === 'E') {
                        if (d.data.score === 9999) {
                            return 'NR*';
                        } else {
                            return '';
                        }
                    } else {
                        return d.data.score;
                    }
                })
                .attr("text-anchor", "middle")
                .attr('y', this.radius / 6)
                .style('font-size', this.radius / 2);
        },
    };

    charts.drawDonuts = function (datum) {
        d3.selectAll('svg').remove();
        var donutKeys = ['overall', 'achievement', 'growth', 'relative', 'gaps'];
        donutKeys.forEach(function (key) {
            var data = extractData(key, datum);
            if (data) {
                var dataArr = [data, getEmptySpace(data)];
                new DrawDonut(key, dataArr);
            }
        });
    }

    return charts;
}(SchoolSearch || {}));