<template>
    <g transform="translate(25,25)">
        <farms 
            v-for="(farm, idx) in farms"
            :key="`farm-${idx}`"
            :parentPos="smJonesPosition"
            :farm="farm"
        />
        <path
            v-for="(node, idx) in nodes.descendants().slice(1)"
            :key="`link-${idx}`"
            class="link"
            :d="drawLink(node)"
        />
        <g 
            v-for="(node, idx) in nodes.descendants()"
            :key="`node-${idx}`"
            class="node"
            :class="getPositionClass(node)"
            :transform="getNodeTransform(node)"
        >
            <f-l-c 
                v-if="node.data.type === 'flcs'"
                :flc="node.data"
            />
            <farmworkers 
                v-else-if="node.data.type === 'farmworkers'"
                :workers="node.data"
            />
            <g v-else>
                <text
                    class="icon"
                    :fill="node.data.color"
                    :fill-opacity="node.data.opacity"
                    dy="10"
                    dx="-14"
                    v-html="node.data.html"
                />
                <text
                    dy=".35em"
                    :y="alignText(node)"
                    class="name"
                >{{ getText(node) }}</text>
            </g>
        </g>
        <y-c-o 
            :parentPos="sunrisePosition"
            :yco="yco"
        />
    </g>
</template>

<script>
import { tree } from 'd3';

// components
import Farmworkers  from '../Farmworkers/Farmworkers.vue';
import FLC          from '../FLC/FLC.vue';
import Farms        from '../Farms/Farms.vue';
import YCO          from '../YCO/YCO.vue';

export default {
    name: 'chart',
    props: {
        width: Number,
        height: Number,
        tree: Object,
        farms: Array,
        yco: Object,
    },
    computed: {
        treemap() {
            return tree().size([this.width - 50, this.height - 100])
        },
        nodes() {
            return this.treemap(this.tree);
        },
        smJonesPosition() {
            const { x, y } = this.nodes.descendants().find(node => node.data.name === 'SM Jones')
            return { x, y };
        },
        sunrisePosition() {
            const { x, y } = this.nodes.descendants().find(node => node.data.name === 'Sunrise Labor')
            return { x, y };
        }
    },
    methods: {
        getNodeTransform(d) {
            return `translate(${d.x},${d.y})`;
        },
        getPositionClass(d) {
            return d.children ? 'node--internal' : 'node--leaf';
        },
        drawLink(d) {
            return `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`;
        },
        getText(d) {
            return d.data.displayName;
        },
        alignText(d) {
            return d.children ? -20 : 20;
        },
    },
    components: {
        Farmworkers,
        Farms,
        YCO,
        FLC,
    },
}
</script>

<style lang="scss">
    .node {
        text { 
            font: 12px sans-serif; 

            &.icon {
                font-family: 'Font Awesome\ 5 Free';
                font-weight: 900;
                font-size: 22px;
            }
        }
    }

    .node--internal text {
        text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
    }

    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 2px;
    }

    .name {
        text-anchor: middle;
    }
</style>
