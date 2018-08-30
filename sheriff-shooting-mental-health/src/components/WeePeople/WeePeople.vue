<template>
    <div>
        <p class="instructions subtext">Scroll to Start ↓</p>
        <div :id="elID"></div>
        <p class="instructions subtext">
            (Each <span class='weepeople' :style="{ color }">n</span> represents about {{ capita }} people)
        </p>
    </div>
</template>

<script>
import peopleBubble from './peopleBubble';

const buildPeopleBubble = scope => {
    const { total, focus, capita, color, elID, curr } = scope;
    scope.viz = peopleBubble(elID);
    scope.viz.run({
        total,
        focus,
        capita,
        color,
        curr
    });
};

export default {
    name: 'wee-people',
    props: {
        total: Number,
        focus: Number,
        capita: Number,
        color: String,
        elID: String,
        curr: String,
    },
    data: function () {
        return {
            viz: null,
            buildPeopleBubble,
        };
    },
    watch: {
        curr() {
            const { total, focus, capita, color, elID, curr } = this;
            if (this.viz) {
                this.viz.run({
                    total,
                    focus,
                    capita,
                    color,
                    curr
                });
            } else {
                this.buildPeopleBubble(this);
            }
        }
    },
    mounted() {
        this.buildPeopleBubble(this);
    }
}
</script>

<style src="./weepeople.css"></style>
<style lang="scss">
    text.person {
        font-size: 1em;
    }
    p.instructions.subtext {
        line-height: 30px;
        color: #999;
        font-size: 1.05em;
        text-align: center;

        span {
            font-size: 1.5em;
        }
    }
</style>