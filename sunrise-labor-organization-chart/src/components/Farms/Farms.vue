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
            <text
                class="tractor"
                :fill="farm.color"
                :fill-opacity="farm.opacity"
                dy="10"
                dx="-14"
                v-html="farm.html"
            />
            <text
                dy=".35em"
                :y="20"
                class="name"
            >{{ farm.displayName }}</text>
        </g>
    </g>
</template>

<script>
export default {
    name: 'farm',
    props: {
        parentPos: Object,
        farm: Object,
    },
    computed: {
        farmPos() {
            switch (this.farm.name) {
                case 'Twin H Farms':
                    return {
                        x: this.parentPos.x * 0.6, 
                        y: this.parentPos.y + (this.parentPos.y * 0.2),
                    };
                case 'Farm One':
                    return {
                        x: this.parentPos.x * 0.2,
                        y: this.parentPos.y + (this.parentPos.y * 0.2),
                    };
                case 'Turek Farms':
                    return {
                        x: this.parentPos.x + (this.parentPos.x - (this.parentPos.x * 0.6)),
                        y: this.parentPos.y + (this.parentPos.y * 0.2),
                    };
                case 'Farm Four':
                    return {
                        x: this.parentPos.x + (this.parentPos.x - (this.parentPos.x * 0.2)),
                        y: this.parentPos.y + (this.parentPos.y * 0.2),
                    };
            }
        },
        transform() {
            return `translate(${this.farmPos.x},${this.farmPos.y})`;
        },
        link() {
            return `M${this.parentPos.x},${this.parentPos.y}
                C${this.parentPos.x},${(this.farmPos.y + this.parentPos.y) / 2} 
                ${this.farmPos.x},${(this.farmPos.y + this.parentPos.y) / 2} 
                ${this.farmPos.x},${this.farmPos.y}`;
        },
    },
}
</script>

<style lang="scss">
    .node {
        text { 
            font: 12px sans-serif;
            
            &.tractor {
                font-family: 'Font Awesome\ 5 Free';
                font-weight: 900;
                font-size: 22px;
            }
        }
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
