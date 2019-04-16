<template>
    <g>
        <text 
            v-for="(person, idx) in people"
            :key="idx"
            class="weepeople worker"
            :x="person.x"
            :y="person.y"
            :dx="-15"
            :dy="-10"
            :style="peopleStyles"
        >
            {{ pluckPerson() }}
        </text>
        <text
            dy="1.35em"
            :y="34"
            class="name"
        >{{ workers.displayName }}</text>
    </g>
</template>

<script>
import { range, shuffle } from 'd3';

export default {
    name: 'farmworkers',
    props: {
        workers: Object,
    },
    data() {
        return {
            numWorkers: Math.floor(Math.random() * (40 - 34)) + 34,
            alphabet: 'abcdefghijklmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        };
    },
    computed: {
        people() {
            return range(this.numWorkers).map(this.setPeoplePositions, this);
        },
        peopleStyles() {
            return {
                opacity: this.workers.opacity,
                fill: this.workers.color,
            };
        },
    },
    methods: {
        setPeoplePositions(idx){
            const theta     = 2 * Math.PI * idx * (Math.sqrt(5) - 1) / 2;
            const radius    = Math.sqrt(idx) * 6;
            return {
                x: radius * Math.cos(theta) + Math.random() * 10 + 5 ,
                y: radius * Math.sin(theta) + Math.random() * 10 + 5,
            };
        },
        pluckPerson() {
            return shuffle(this.alphabet)[0];
        },
    },
}

</script>

<style lang="scss">
    text.weepeople.worker {
        font-family: WeePeople;
        font-size: 20px;
    }
</style>
