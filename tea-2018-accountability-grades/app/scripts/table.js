/* global, $, _ */

var SchoolSearch = (function (charts) {
    var columnMap = {
        name: 'School',
        grdspan: 'Grades',
        overall_rating: 'Rating',
        overall_scaled_score: 'Score',
    };

    function Table (data, sendHeight) {
        this.data = this.mapDataToColumns(data);
        this.table = this.getTable();
        sendHeight();
    }

    Table.prototype = {
        properNounCasing: function (str) {
            if (str && typeof str === 'string') {
                var lower = str.toLowerCase();
                return lower.split(' ').map(function (word) {
                    if (/(^isd$|^hs$|^stem$|^jc$)/.test(word)) {
                        return word.toUpperCase();
                    } else {
                        return word[0].toUpperCase() + word.substr(1);
                    }
                }).join(' ');
            } else {
                return str;
            }
        },

        isSchool: function (school) {
            return !school.is_district;
        },

        mapDataToColumns: function (data) {
            var that = this;
            var columns = ['name', 'grdspan', 'overall_rating', 'overall_scaled_score'];
            return data.reduce(function (res, school) {
                if (that.isSchool(school)) {
                    var row = {};
                    columns.forEach(function (key) {
                        if (key === 'name') {
                           row[columnMap[key]] = school[key] ? that.properNounCasing(school[key]) : '---'; 
                        } else {
                            row[columnMap[key]] = school[key] ? school[key] : '---';
                        }
                    });
                    res.push(row);
                }
                return res;
            }, []);
        },

        getTable: function () {
            var that = this;
            return $('table#school-table').DataTable({
                data: that.data,
                lengthChange: false,
                columns: [
                    { data: 'School' },
                    { data: 'Grades' },
                    { data: 'Rating' },
                    { data: 'Score' }
                ],
            });
        }
    };

    charts.tableInit = function (data, sendHeight) {
        if (this.table) {
            this.table.destroy();
        }
        this.table = new Table(data, sendHeight);
    };

    return charts;
}(SchoolSearch || {}));