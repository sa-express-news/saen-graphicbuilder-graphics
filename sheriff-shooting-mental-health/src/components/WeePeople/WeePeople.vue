<template>
    <div>
        <p class="instructions subtext">Scroll to Start ↓</p>
        <div :id="elID"></div>
        <p class="instructions subtext">
            (Each <span class='weepeople' :style="{ color: color, fontSize: '1.4em' }">n</span> represents about {{ capita }} people)
        </p>
    </div>
</template>

<script>
import peopleBubble from './peopleBubble';

export default {
    name: 'wee-people',
    props: {
        total: Number,
        focus: Number,
        capita: Number,
        color: String,
        elID: String,
    },
    mounted: function () {
        const { total, focus, capita, color, elID } = this;
        peopleBubble({
            total,
            focus,
            capita,
            color,
            elID
        })
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
    }
</style>