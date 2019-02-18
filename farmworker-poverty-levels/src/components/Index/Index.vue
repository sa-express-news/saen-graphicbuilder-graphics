<template>
    <div>
        <div class="graphic">
            <h1>{{ META.graphic_title }}</h1>
            <p class="subtext">{{ META.prose }}</p>

            <div id="graphic-container">
                <div class="bar-chart">
                    <bar
                        v-for="(data, idx) in POVERTY"
                        class="chart-row"
                        :class="stringToClass(data.group)"
                        :key="idx"
                        :last="idx === data.length - 1"
                        :group="data.group"
                        :percent="data.percent"
                        :max="maxPercent"
                    />
                </div>
            </div>

            <div class="footer">
                <ul>
                    <li v-if="META.note" class="note">*{{ META.note }}</li>
                    <li v-if="META.source">Source:&nbsp;
                        <a v-if="META.source_url" :href="META.source_url">{{ META.source }}</a>
                        <span v-else>{{ META.source }}</span>
                    </li>
                    <li v-if="META.credit">Credit: {{ META.credit }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script src="./Index.js"></script>
<style src="./Index.scss" lang="scss"></style>