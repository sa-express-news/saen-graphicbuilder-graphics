import * as d3 from 'd3';

import getBoxSpecs from './getBoxSpecs';

class PeopleBubble {
    constructor(config) {
        this.focus        = 80 // this.getPeople(config.focus);

        this.width        = this.getWidth();
        this.height       = this.getHeight();
        this.color        = this.getColor(config.color);
        this.alphabet     = this.getAlphabet();
        this.peopleSpecs  = this.getPeopleSpecs(config.total, config.capita);
        this.people       = this.getPeople(config.total, config.capita);
        this.svg          = this.getSVG(config.elID);

        this.setXPosition = this.setXPosition.bind(this);
        this.setYPosition = this.setYPosition.bind(this);
        this.setOpacity   = this.setOpacity.bind(this);
        this.pluckPerson  = this.pluckPerson.bind(this);

        this.drawPeople();
    }    

    getWidth() {
        return window.innerWidth < 720 ? window.innerWidth : 720;
    }

    getHeight() {
        return Math.round(this.width * 0.4);
    }

    getColor(color) {
        const colorMap = {
            blue: '#08519c',
        };
        return colorMap[color];
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

    setXPosition(idx) {
        const row = Math.floor(idx / this.peopleSpecs.cols);
        return (idx - (this.peopleSpecs.cols * row)) * this.peopleSpecs.width;
    }

    setYPosition(idx) {
        return ((Math.floor(idx / this.peopleSpecs.cols)) * this.peopleSpecs.height) + this.peopleSpecs.height;
    }

    setOpacity(idx) {
        return (idx + 1) > this.focus ? 0.5 : 1;
    }

    pluckPerson() {
        return d3.shuffle(this.alphabet)[0];
    }

    drawPeople() {
        this.svg.selectAll('.person')
                .data(d3.range(this.people)).enter().append('text')
                    .attr('textLength', this.peopleSpecs.width)
                    .attr('class', 'weepeople person')
                    .attr('x', this.setXPosition)
                    .attr('y', this.setYPosition)
                    .style('opacity', this.setOpacity)
                    .style('fill', this.color)
                        .text(this.pluckPerson);
    }
}

export default config => {
    return new PeopleBubble(config);
}