import * as d3 from 'd3';

import getBoxSpecs from './getBoxSpecs';

class PeopleBubble {
    constructor(elID) {
        this.width        = this.getWidth();
        this.height       = this.getHeight();
        
        this.alphabet     = this.getAlphabet();
        this.svg          = this.getSVG(elID);

        this.setOpacity             = this.setOpacity.bind(this);
        this.pluckPerson            = this.pluckPerson.bind(this);
        this.runStandardSimulation  = this.runStandardSimulation.bind(this);
        this.runClusterSimulation   = this.runClusterSimulation.bind(this);
        this.centerGroup            = this.centerGroup.bind(this);
    }    

    getWidth() {
        return window.innerWidth < 720 ? window.innerWidth : 720;
    }

    getHeight() {
        return Math.round(this.width * 0.5);
    }

    getAlphabet() {
        return 'abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSUVWXYZ'.split('');
    }

    getPeopleSpecs(total, capita) {
      return getBoxSpecs(total, capita, this.width, this.height);
    }

    setInitalPositions(idx) {
        return {
            r: 6,
            x: this.setXPosition(idx),
            y: this.setYPosition(idx),
            i: idx,
        };
    }

    getPeople(people, capita) {
        return d3.range(Math.floor(people / capita)).map(this.setInitalPositions.bind(this));
    }

    getFocus(people, capita) {
        return Math.floor(people / capita);
    }

    getRandomPos(axis) {
        // not currently in use
        return d => {
            const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            const distance    = (Math.random() * 3) + 1;
            return d[axis] + (distance * plusOrMinus);
        };
    }

    getInwardYPos(d) {
        const plusOrMinus   = Math.floor(d.i / this.peopleSpecs.cols) >= (this.peopleSpecs.rows / 2) ? -1 : 1;
        const distance      = (Math.random() * 3.2) + 1;
        return d.y + (distance * plusOrMinus);
    }

    getInwardXPos(d) {
        const xPos          = d.i - (Math.floor(d.i / this.peopleSpecs.cols) * this.peopleSpecs.cols);
        const plusOrMinus   = xPos >= (this.peopleSpecs.cols / 2) ? -1 : 1;
        const distance      = (Math.random() * 3.2) + 1;
        return d.x + (distance * plusOrMinus);
    }

    getStandardSimulation() {
        return d3.forceSimulation()
                .force('collision', d3.forceCollide().strength(0.0001).radius(function (d) { return d.r; }))
                .force('x', d3.forceX().x(this.getInwardXPos.bind(this)).strength(0.005))
                .force('y', d3.forceY().y(this.getInwardYPos.bind(this)).strength(0.005))
                .alphaDecay(0.005)
                .nodes(this.people).restart().stop();
    }

    getXSplitPos(d) {
        const base = this.setOpacity(d) === 1 ? this.width * 0.25 : this.width * 0.75;
        return ((Math.random() * 3.2) + 1) + base
    }

    getYSplitPos(d) {
        const base = this.setOpacity(d) === 1 ? this.height * 0.25 : this.height * 0.75;
        return ((Math.random() * 3.2) + 1) + base
    }

    getSplitSimulation() {
        return d3.forceSimulation()
                .force('collision', d3.forceCollide().strength(0.01).radius(function (d) { return d.r; }))
                .force('x', d3.forceX().x(this.getXSplitPos.bind(this)).strength(0.005))
                .force('y', d3.forceY().y(this.getYSplitPos.bind(this)).strength(0.005))
                .alphaDecay(0.05)
                .nodes(this.people).restart().stop();
    }

    getXClusterPos(d) {
        const base = this.setOpacity(d) === 1 ? this.width * 0.3 : this.width * 0.7;
        return ((Math.random() * 3.2) + 1) + base
    }

    getYClusterPos(d) {
        return ((Math.random() * 3.2) + 1) + (this.height * 0.5)
    }

    getSplitClusterSimulation() {
        return d3.forceSimulation()
                .force('collision', d3.forceCollide().strength(0.8).radius(function (d) { return d.r * 1.3; }))
                .force('x', d3.forceX().x(this.getXClusterPos.bind(this)).strength(0.05))
                .force('y', d3.forceY().y(this.getYClusterPos.bind(this)).strength(0.05))
                .velocityDecay(0.5)
                .nodes(this.people).restart().stop();
    }

    getSVG(id) {
        return d3.select('#' + id).append('svg')
                        .attr('width', this.width)
                        .attr('height', this.height)
                    .append('g');
    }

    getPeopleSize() {
        const { width, height } = this.peopleSpecs;
        return `${Math.min(width, height) * 1.5}px`;
    }

    setXPosition(idx) {
        const row = Math.floor(idx / this.peopleSpecs.cols);
        return (idx - (this.peopleSpecs.cols * row)) * this.peopleSpecs.width;
    }

    setYPosition(idx) {
        return (((Math.floor(idx / this.peopleSpecs.cols)) * this.peopleSpecs.height) + this.peopleSpecs.height);
    }

    setOpacity(d) {
        return (d.i + 1) > this.focus ? 0.2 : 1;
    }

    pluckPerson() {
        return d3.shuffle(this.alphabet)[0];
    }

    drawPeople() {
        const people = this.svg.selectAll('.person')
                .data(this.people);

        const newPeople = people.enter().append('text')
                    .attr('class', 'weepeople person');

        const crowd = newPeople.merge(people)
                        .attr('x', function (d) { return d.x; })
                        .attr('y', function (d) { return d.y; })
                        .style('font-size', this.fontSize)
                        .style('opacity', this.setOpacity)
                        .style('fill', this.color)
                        .text(this.pluckPerson);

        people.exit()
                .style('opacity', 1).transition()
                .duration(500).style('opacity', 0.2)
                .remove();

        return crowd;
    }

    centerGroup() {
        const bbox  = this.svg.node().getBBox();
        const x     = (this.width / 2) - (bbox.width / 2);
        const y     = -((this.height / 2) - (bbox.height / 2));
        this.svg.attr('transform', `translate(${x},${y})`);
    }

    runStandardSimulation() {
        this.simulation.tick();
        this.crowd.attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; });
        if (this.simulation.alpha() > 0.001) {
            requestAnimationFrame(this.runStandardSimulation);
        }
    }

    runClusterSimulation() {
        d3.range(16).forEach(this.simulation.tick);
        this.crowd.attr('x', function (d) { return d.x; })
                .attr('y', function (d) { return d.y; });
        if (this.simulation.alpha() > 0.001) {
            requestAnimationFrame(this.runClusterSimulation);
        }
    }

    buildStandards(config) {
        this.color        = config.color;
        this.peopleSpecs  = this.getPeopleSpecs(config.total, config.capita);
        this.fontSize     = this.getPeopleSize();
        this.people       = this.getPeople(config.total, config.capita);
        this.focus        = this.getFocus(config.focus, config.capita);
    }

    buildOne(config) {
        this.buildStandards(config);

        this.simulation = this.getStandardSimulation();

        this.crowd = this.drawPeople();
        requestAnimationFrame(this.runStandardSimulation);
        if (this.people.length < 4) this.centerGroup();
    }

    buildTwo(config) {
        this.buildStandards(config);

        this.simulation = this.getSplitSimulation();

        this.crowd = this.drawPeople();
        requestAnimationFrame(this.runStandardSimulation);
        if (this.people.length < 4) this.centerGroup();
    }

    buildThree(config) {
        this.buildStandards(config);

        this.simulation = this.getSplitClusterSimulation();

        this.crowd = this.drawPeople();
        requestAnimationFrame(this.runClusterSimulation);
        if (this.people.length < 4) this.centerGroup();
    }

    buildFour(config) {
        this.buildStandards(config);

        this.simulation = this.getSplitClusterSimulation();

        this.crowd = this.drawPeople();
        requestAnimationFrame(this.runClusterSimulation);
        if (this.people.length < 4) this.centerGroup();
    }

    run(config) {
        switch (config.curr) {
            case 'ONE':
                this.buildOne(config);
                break;
            case 'TWO':
                this.buildTwo(config);
                break;
            case 'THREE':
                this.buildThree(config);
                break;
            case 'FOUR':
                this.buildFour(config);
                break;
            default:
                return null;
        }
    }
}

export default config => {
    return new PeopleBubble(config);
}