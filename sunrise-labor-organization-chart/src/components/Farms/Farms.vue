<template>
    <g>
        <path
            class="link"
            :d="drawLink(offset, smJones)"
        />
        <g 
            class="node node--leaf"
            :transform="getNodeTransform(offset, smJones)"
        >
            <circle r="10" />
            <text
                dy=".35em"
                :y="20"
                class="name"
            >{{ getText(offset) }}</text>
        </g>
    </g>
</template>

<script>
import farmPositions from './farmPositions';

export default {
    name: 'offset-nodes',
    props: {
        smJones: Object,
        offset: Object,
    },
    methods: {
        getNodeTransform(d, parent) {
            return farmPositions[d.name].nodeTransform(parent);
        },
        drawLink(d, parent) {
            return farmPositions[d.name].linkPath(parent);
        },
        getText(d) {
            return d.displayName;
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

    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 2px;
    }

    .name {
        text-anchor: middle;
    }
</style>
