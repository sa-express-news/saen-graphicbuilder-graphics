/* global, d3 */

var TreeMap = (function () {
  'use strict';

  var colorArr = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5'];

  function TreeBuilder (id, url) {
    this.init = this.init.bind(this, id);
    this.getData(url, this.init);
  }

  TreeBuilder.prototype = {
    setRootSetter: function () {
      return d3.stratify()
          .id(function(d) { return d.name; })
          .parentId(function(d) { 
            console.log(d)
            return d.state; 
          })
    },

    setHeight: function () {
      return Math.round(this.width * 0.75);
    },

    setWidth: function () {
      return Math.round(window.innerWidth > 720 ? 720 : window.innerWidth);
    },

    /* 
     * initalize chart in callback
     */

    init: function (id, data) {
      this.width      = this.setWidth();
      this.height     = this.setHeight();
      this.rootSetter = this.setRootSetter();
      
      console.log(this.rootSetter(data));
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