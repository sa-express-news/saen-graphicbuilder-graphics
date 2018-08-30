<template>
    <div 
        :style="{ margin: `${marginTop} auto 50px` }"
        class="prose"
        v-observe-visibility="{
          callback: visibilityChanged,
          intersection: {
            threshold: 0.9,
          },
          throttle: 300,
        }"
    >
        {{ prose }}
        <hr />
    </div>
</template>

<script>
export default {
    name: 'explination',
    props: { 
        prose: String,
        graphic: String,
    },
    data: function () {
        return {
            instructionsHeight: 75,
            graphicSize: 0,
            isVisible: false,
        }
    },
    computed: {
        marginTop: function () {
            return `${this.graphicSize + this.instructionsHeight + 10}px`;
        }
    },
    methods: {
        visibilityChanged (isVisible, entry) {
            if (isVisible !== this.isVisible) {
                console.log(entry)
            }
        }
    },
    mounted: function () {
        this.graphicSize = window.innerWidth < 720 ? window.innerWidth * 0.4 : 720 * 0.4;
    },
}
</script>

<style lang="scss">
    .prose {
        color: #282828;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 300;
        letter-spacing: .03em;
        width: 70%;
        background: rgba(255,255,255,.9);
        padding: 15px;
        -webkit-box-shadow: 0px 0px 20px 12px rgba(255,255,255,1);
        -moz-box-shadow: 0px 0px 20px 12px rgba(255,255,255,1);
        box-shadow: 0px 0px 20px 12px rgba(255,255,255,1);

        hr {
          border: 0;
          height: 1px;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
          width: 10%;
        }
    }
</style>