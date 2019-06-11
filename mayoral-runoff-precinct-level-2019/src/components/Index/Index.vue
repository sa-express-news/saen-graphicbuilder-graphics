<template>
    <div>
        <div class="graphic">
            <h1>{{ META.graphic_title }}</h1>
            <p class="subtext">{{ META.prose }}</p>

            <div id="graphic-container">
                <div class="legend">
                    <div class="legend-title">Precinct winners are color-coded as follows:</div>
                    <div class="legend-scale">
                        <ul class="legend-labels">
                            <li><span class="nirenberg"></span>Nirenberg</li>
                            <li><span class="brockhouse"></span>Brockhouse</li>
                            <li><span class="tie"></span>Tie</li>
                        </ul>
                    </div>
                </div>
                <PrecinctMap />
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