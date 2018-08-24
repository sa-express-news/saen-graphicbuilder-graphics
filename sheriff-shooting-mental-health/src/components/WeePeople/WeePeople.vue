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
        elID: String,
    },
    mounted: function () {
        const { total, focus, radius, capita, elID } = this;
        peopleBubble({
            total,
            focus,
            radius,
            capita,
            elID
        })
    }
}
</script>

<style src="./weepeople.css"></style>
<style lang="scss"></style>