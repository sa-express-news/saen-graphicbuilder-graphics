<template>
    <g>
        <path
            class="link"
            :d="link"
        />
        <g 
            class="node node--leaf"
            :transform="transform"
        >
            <circle r="10" />
            <text
                dy=".35em"
                :y="20"
                class="name"
            >{{ yco.displayName }}</text>
        </g>
    </g>
</template>

<script>
export default {
    name: 'y-c-o',
    props: {
        parentPos: Object,
        yco: Object,
    },
    computed: {
        pos() {
            return {
                x: this.parentPos.x * 0.6,
                y: this.parentPos.y + (this.parentPos.y * 0.1),
            }
        },
        transform() {
            return `translate(${this.pos.x},${this.pos.y})`;
        },
        link() {
            return `M${this.parentPos.x},${this.parentPos.y}
                C${this.parentPos.x},${(this.pos.y + this.parentPos.y) / 2} 
                ${this.pos.x},${(this.pos.y + this.parentPos.y) / 2} 
                ${this.pos.x},${this.pos.y}`;
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
