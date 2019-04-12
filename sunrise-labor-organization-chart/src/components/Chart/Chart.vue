<template>
    <g>
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
        ></g>
    </g>
</template>

<script>
import * as d3 from 'd3';

import buildTree from './buildTree';

export default {
    name: 'chart',
    props: {
        width: Number,
        height: Number,
        flatTree: Array,
    },
    data() {
        return {
            verticalLink: d3.linkVertical().x(d => d.x).y(d => d.y),
        };
    },
    computed: {
        treemap() {
            return d3.tree().size([this.width, this.height])
        },
        nodes() {
            const tree = d3.hierarchy(buildTree(this.flatTree));
            return this.treemap(tree);
        },
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
    },
}
</script>

<style lang="scss">
    .node {
        circle {
            fill: #fff;
            stroke: steelblue;
            stroke-width: 3px;
        }

        text { font: 12px sans-serif; }
    }

    .node--internal text {
        text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
    }

    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 2px;
    }
</style>
