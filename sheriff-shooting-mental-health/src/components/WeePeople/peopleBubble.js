import * as d3 from 'd3';

import getBoxSpecs from './getBoxSpecs';

class PeopleBubble {
    constructor(config) {
        this.width        = this.getWidth();
        this.height       = this.getHeight();
        this.color        = config.color;
        this.alphabet     = this.getAlphabet();
        this.peopleSpecs  = this.getPeopleSpecs(config.total, config.capita);
        this.fontSize     = this.getPeopleSize();
        this.people       = this.getPeople(config.total, config.capita);
        this.focus        = this.getPeople(config.focus, config.capita);
        this.svg          = this.getSVG(config.elID);

        this.setXPosition   = this.setXPosition.bind(this);
        this.setYPosition   = this.setYPosition.bind(this);
        this.setOpacity     = this.setOpacity.bind(this);
        this.pluckPerson    = this.pluckPerson.bind(this);
        this.centerGroup    = this.centerGroup.bind(this);

        this.drawPeople();
        this.centerGroup();
    }    

    getWidth() {
        return window.innerWidth < 720 ? window.innerWidth : 720;
    }

    getHeight() {
        return Math.round(this.width * 0.4);
    }

    getAlphabet() {
        return 'abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSUVWXYZ'.split('');
    }

    getPeopleSpecs(total, capita) {
      return getBoxSpecs(total, capita, this.width, this.height);
    }

    getPeople(people, capita) {
        return Math.floor(people / capita);
    }

    getSVG(id) {
        return d3.select('#' + id).append('svg')
                        .attr('width', this.width)
                        .attr('height', this.height)
                    .append('g');
    }

    getPeopleSize() {
        const { width, height } = this.peopleSpecs;
        return `${Math.min(width, height)}px`;
    }

    setXPosition(idx) {
        const row = Math.floor(idx / this.peopleSpecs.cols);
        return (idx - (this.peopleSpecs.cols * row)) * this.peopleSpecs.width;
    }

    setYPosition(idx) {
        return (((Math.floor(idx / this.peopleSpecs.cols)) * this.peopleSpecs.height) + this.peopleSpecs.height);
    }

    setOpacity(idx) {
        return (idx + 1) > this.focus ? 0.5 : 1;
    }

    pluckPerson() {
        return d3.shuffle(this.alphabet)[0];
    }

    drawPeople() {
        const that = this;
        this.svg.selectAll('.person')
                .data(d3.range(this.people)).enter().append('text')
                    .attr('class', 'weepeople person')
                    .attr('x', this.setXPosition)
                    .attr('y', this.setYPosition)
                    .style('font-size', this.fontSize)
                    .style('opacity', this.setOpacity)
                    .style('fill', this.color)
                .merge(this.svg)
                    .text(this.pluckPerson)
                .exit()
                    .style('opacity', 1).transition()
                    .duration(500).style('opacity', 0.2)
                    .on('end', this.centerGroup)
                    .remove();
    }

    centerGroup() {
        const bbox  = this.svg.node().getBBox();
        const x     = (this.width / 2) - (bbox.width / 2);
        const y     = -((this.height / 2) - (bbox.height / 2));
        this.svg.attr('transform', `translate(${x},${y})`);
    }
}

export default config => {
    return new PeopleBubble(config);
}