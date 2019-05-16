<template>
    <g
        v-tooltip="{ content: workers.tooltip, class: workers.tooltip ? 'active' : 'disabled' }"
        :class="{ 'has-tooltip': workers.tooltip }"
    >
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
import { range, shuffle } from 'd3';

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
    },
}

</script>

<style lang="scss">
    .has-tooltip {
        cursor: pointer;
    }

    text.weepeople.worker {
        font-family: WeePeople;
        font-size: 20px;
    }
</style>
