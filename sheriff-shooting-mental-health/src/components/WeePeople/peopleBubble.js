import * as d3 from 'd3';

class PeopleBubble {
    constructor(config) {
        this.width  = this.getWidth();
        this.height = this.getHeight();
        this.svg    = this.getSVG(config.elID);
    }    

    getWidth() {
        return window.innerWidth < 720 ? window.innerWidth : 720;
    }

    getHeight() {
        return Math.round(this.width * 0.4);
    }

    getSVG(id) {
        return d3.select('#' + id).append('svg')
                        .attr('width', this.width)
                        .attr('height', this.height)
                    .append('g')
                        .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
    }


}

export default config => {
    //return new PeopleBubble(config);

var areaHeight = window.innerWidth < 720 ? window.innerWidth : 720;
var areaWidth = Math.round(areaHeight * 0.4);
var N = Math.floor(config.total / config.capita);                           //set amount of rectangles you want to fit
var rectRatio = 16 / 9;                   //set rectangle ratio
var gutter = [2, 2];                  //set x and y spacing between rectangles
var cols, rows, rectHeight, rectWidth; //variables that we need to calculate

function rowIterator(iterator) {
   rows = iterator;
   cols = Math.ceil(N/rows);  

   rectHeight = (areaHeight - (rows-1)*gutter[1])/rows;          
   rectWidth = rectHeight*rectRatio;

   if (cols * rectWidth + (cols - 1)*gutter[0] > areaWidth) {
       rowIterator(rows + 1);
   }
}

rowIterator(1);                       //feed initial value
var size1 = [rectWidth, rectHeight];

function colIterator(iterator) {
   cols = iterator;
   rows = Math.ceil(N/cols);

   rectWidth = (areaWidth - (cols - 1)*gutter[0])/cols;
   rectHeight = rectWidth/rectRatio;

   if (rows * rectHeight + (rows - 1)*gutter[1] > areaHeight) {
       colIterator(cols + 1);
   }
}
colIterator(1);
var size2 = [rectWidth, rectHeight];
var optimalRectSize = [Math.max(size1[0], size2[0]), Math.max(size1[1], size2[1])]
console.log(optimalRectSize);
console.log(cols)
console.log(rows)
}