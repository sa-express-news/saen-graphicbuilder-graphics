import * as d3 from 'd3';

import getBoxSpecs from './getBoxSpecs';

class PeopleBubble {
    constructor(config) {
        this.width        = this.getWidth();
        this.height       = this.getHeight();
        this.peopleSpecs  = this.getPeopleSpecs(config.total, config.capita);
        this.svg          = this.getSVG(config.elID);
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
                      .append('rect')
                          .attr('height', this.peopleSpecs.height)
                          .attr('width', this.peopleSpecs.width)
                          .style('color', 'blue');
    }

    getPeopleSpecs(total, capita) {
      return getBoxSpecs(total, capita, this.width, this.height);
    }
}

export default config => {
    return new PeopleBubble(config);
}