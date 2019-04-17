<template>
    <g>
        <text 
            v-for="(person, idx) in people"
            :key="person.x + idx"
            class="weepeople worker"
            :x="person.x"
            :y="person.y"
            :dx="-15"
            :dy="-10"
            :style="peopleStyles"
        >
            {{ person.p }}
        </text>
        <text
            dy="1.35em"
            :y="44"
            class="name"
        >{{ workers.displayName }}</text>
    </g>
</template>

<script>
import { range, shuffle, forceSimulation, forceCollide, forceX, forceY } from 'd3';

const alphabet = 'abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default {
    name: 'farmworkers',
    props: {
        workers: Object,
    },
    data() {
        return {
            people: range(Math.floor(Math.random() * (45 - 40)) + 40).map(this.setPeoplePositions, this),
        };
    },
    computed: {
        peopleStyles() {
            return {
                opacity: this.workers.opacity,
                fill: this.workers.color,
            };
        },
        simulation() {
            return forceSimulation()
                .force('x', forceX().x(this.moveX.bind(this)).strength(0.005))
                .force('y', forceY().y(this.moveY.bind(this)).strength(0.005))
                .alphaDecay(0.005)
                .nodes(this.people).restart();
        },
    },
    methods: {
        setPeoplePositions(idx){
            const theta     = 2 * Math.PI * idx * (Math.sqrt(5) - 1) / 2;
            const radius    = Math.sqrt(idx) * 7;
            return {
                x: radius * Math.cos(theta) + Math.random() * 10 + 5 ,
                y: radius * Math.sin(theta) + Math.random() * 10 + 5,
                p: this.pluckPerson(),
            };
        },
        pluckPerson() {
            return shuffle(alphabet)[0];
        },
        plusOrMinus() {
            return Math.random() < 0.5 ? -1 : 1;
        },
        moveX(d) {
            const distance = (Math.random() * 3.2) + 1;
            return d.x + (distance * this.plusOrMinus());
        },
        moveY(d) {
            const distance = (Math.random() * 3.2) + 1;
            return d.y + (distance * this.plusOrMinus());
        },
        runSimulation() {
            this.simulation.tick();
            if (this.simulation.alpha() > 0.001) {
                requestAnimationFrame(this.runSimulation);
            }
        },
        startSimulation() {
            document.removeEventListener('mouseenter', this.startSimulation);
            document.removeEventListener('touchstart', this.startSimulation);
            requestAnimationFrame(this.runSimulation);
        },
        prepSimulation() {
            document.addEventListener('mouseenter', this.startSimulation);
            document.addEventListener('touchstart', this.startSimulation);
        },
    },
    mounted() {
        this.prepSimulation();
    },
    destroyed() {
        document.removeEventListener('mouseenter', this.startSimulation);
        document.removeEventListener('touchstart', this.startSimulation);
    },
}

</script>

<style lang="scss">
    text.weepeople.worker {
        font-family: WeePeople;
        font-size: 20px;
    }
</style>
