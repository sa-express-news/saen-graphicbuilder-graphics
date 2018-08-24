<template>
    <div :id="elID"></div>
</template>

<script>
import peopleBubble from './peopleBubble';

export default {
    name: 'wee-people',
    props: {
        total: Number,
        focus: Number,
        radius: Number,
        capita: Number,
        color: String,
        elID: String,
    },
    mounted: function () {
        const { total, focus, radius, capita, color, elID } = this;
        peopleBubble({
            total,
            focus,
            radius,
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
        font-size: 1.5em;
    }
</style>