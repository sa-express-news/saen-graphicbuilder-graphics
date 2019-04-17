<template>
    <g>
        <text 
            class="weepeople flc"
            :style="peopleStyles"
            dy="10"
            dx="-14"
        >{{ this.pluckPerson() }}</text>
        <text
            dy="1.35em"
            :y="15"
            class="name"
        >{{ flc.displayName }}</text>
    </g>
</template>

<script>
import { shuffle } from 'd3';

export default {
    name: 'f-l-c',
    props: {
        flc: Object,
    },
    data() {
        return {
            alphabet: 'ABCFIKLMNOPTW'.split(''),
        };
    },
    computed: {
        peopleStyles() {
            return {
                opacity: this.flc.opacity,
                fill: this.flc.color,
            };
        },
    },
    methods: {
        pluckPerson() {
            return shuffle(this.alphabet)[0];
        },
    },
}

</script>

<style lang="scss">
    text.weepeople.flc {
        font-family: WeePeople;
        font-size: 48px;
    }
</style>
