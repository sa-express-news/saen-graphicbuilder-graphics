<template>
    <div class="set">
        <div class="column highs">
            <div class="column-color highs" :style="{ height: setBarHeight(highs) }">
                <span :class="{ outside: isOutside(highs) }" class="column-value highs">{{ highs }}</span>
            </div>
        </div>
        <div class="column lows">
            <div class="column-color lows" :style="{ height: setBarHeight(lows) }">
                <span :class="{ outside: isOutside(lows) }" class="column-value lows">{{ lows }}</span>
            </div>
        </div>
        <div class="column-label">{{ humanReadableLabel }}</div>
    </div>
</template>

<script>
    export default {
        name: 'bar',
        props: {
            decade: String,
            name: String,
            highs: Number,
            lows: Number,
            last: Boolean,
            getMax: Function,
        },
        computed: {
            max() { return this.getMax(this.name); },
            humanReadableLabel() { return this.decade.replace(/_/, '–'); },
        },
        methods: {
            setBarHeight(count) {
                return `${(+count / this.max) * 100}%`;
            },
            isOutside(count) {
                return parseInt(this.setBarHeight(count), 10) < 20;
            },
        },
    }
</script>

<style lang="scss">
    @import '~express-news-styleguide/init-base';

    $red: #B12125;
    $lightRed: #DC8B6A;
    $darkBlue: #3E67B0;
    $blue: #44ABDF;
    $yellow: #FCC10F;
    $lightYellow: #FCE598;
    $teal: #379D92;
    $lightTeal: #9BCEC8;
    $violet: #742E66;
    $lightViolet: #993D88;
    $gunmetal: #4C5A69;
    $lightMetal: #929AA3;

    .set {
        width: 19%;
        float: left;
        height: 100%;
        margin: 0 0.5%;
        position: relative;
    }
    
    .column {
        margin: 0;
        width: 50%;
        display: inline-block;
    }

    .column-color {
        background-color: $red;
        bottom: 0;
        position: absolute;
        width: 50%;
        display: inline-block;

        &.lows { background-color: $lightRed; }
    }

    .column-label {
        bottom: -3.8em;
        left: -0.4em;
        position: absolute;
        text-align: center;
        width: 65px;
        transform: rotate(-75deg);
        transform-origin: right, top;
        -ms-transform: rotate(-75deg);
        -ms-transform-origin:right, top; 
        -webkit-transform: rotate(-75deg);
        -webkit-transform-origin:right, top;
    }

    .column-value {
        color: $white;
        font-size: 1em;
        margin: .25em 0;
        position: absolute;
        text-align: center;
        text-shadow: 0 0 .1em #333;
        width: 100%;

        @include mediaquery($default-tablet) {
            font-size: 1.1em;
        }

        &.outside {
            color: $red;
            margin: -1.5em 0;
            text-shadow: none;

            &.lows { color: $lightRed; }
        }
    }

    #san-antonio {
        .column-color {
            &.highs { background-color: $red; }
            &.lows { background-color: $lightRed; }
        }
        .column-value.outside {
            &.highs { color: $red; }
            &.lows { color: $lightRed; }
        }
    }

    #llano {
        .column-color {
            &.highs { background-color: $darkBlue; }
            &.lows { background-color: $blue; }
        }
        .column-value.outside {
            &.highs { color: $darkBlue; }
            &.lows { color: $blue; }
        }
    }

    #boerne {
        .column-color {
            &.highs { background-color: $yellow; }
            &.lows { background-color: $lightYellow; }
        }
        .column-value.outside {
            &.highs { color: $yellow; }
            &.lows { color: $lightYellow; }
        }
    }

    #luling {
        .column-color {
            &.highs { background-color: $teal; }
            &.lows { background-color: $lightTeal; }
        }
        .column-value.outside {
            &.highs { color: $teal; }
            &.lows { color: $lightTeal; }
        }
    }

    #south {
        .column-color {
            &.highs { background-color: $violet; }
            &.lows { background-color: $lightViolet; }
        }
        .column-value.outside {
            &.highs { color: $violet; }
            &.lows { color: $lightViolet; }
        }
        .column-label {
            @include mediaquery($default-tablet) {
                left: 2em;
            }
        }
    }

    #us {
        .column-color {
            &.highs { background-color: $gunmetal; }
            &.lows { background-color: $lightMetal; }
        }
        .column-value.outside {
            &.highs { color: $gunmetal; }
            &.lows { color: $lightMetal; }
        }
        .column-label {
            @include mediaquery($default-tablet) {
                left: 2em;
            }
        }
    }
</style>
