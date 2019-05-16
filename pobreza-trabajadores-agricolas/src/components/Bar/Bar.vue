<template>
    <div>
        <div class="row-label">{{ group }}</div>
        <div :class="{ 'last-row': last }" class="row-bar">
            <span :class="group" class="bar-color" :style="{ width: setBarWidth(percent) }">
                <span class="bar-value">{{ percent }}%</span>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'bar',
        props: {
            group: String,
            percent: Number,
            last: Boolean,
            max: Number,
        },
        methods: {
            setBarWidth(percent) {
                return `${(+percent / this.max) * 100}%`;
            },
        },
    }
</script>

<style lang="scss">
    @import '~express-news-styleguide/init-base';

    $label-width: 26%;

    $blue: #4aa1cc;
    $green: #008990;
    $red: #d4626e;
    $yellow: #ffc200;

    .chart-row {
        @include clearfix;
    }

    .row-label {
        float: left;
        font-weight: 700;
        padding: .5em 1em .5em 0;
        text-align: right;
        width: $label-width;
    }

    .row-bar {
        float: left;
        padding: 0 0 .75em;
        width: 95% - $label-width;
    }

    .last-row {
        margin: 0;
    }

    .bar-color {
        background-color: #1775ae;
        display: block;
        height: 100%;
        padding: .5em .5em .5em 0;
        text-align: right;
    }

    .bar-value {
        color: rgb(255, 255, 255);
        text-shadow: 0 0 .125em rgba(0, 0, 0, .4);
    }
</style>
