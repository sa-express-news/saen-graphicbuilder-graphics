<template>
    <div>
        <div class="graphic">
            <h1>{{ META.graphic_title }}</h1>
            <p class="subtext">{{ META.prose }}</p>

            <div id="graphic-container">
                <span class="is-dual-language">
                    <input type="checkbox" id="is-dual-language" v-model="onlyDualLanguage">
                    <label for="is-dual-language">See only dual language schools</label>
                </span>
                <hr class="spacer" />
                <div class="legend">
                    <div class="legend-scale">
                        <ul class="legend-labels">
                            <li><span class="dual-language"></span>Dual language schools</li>
                            <li><span class="ell"></span>All schools with EL programs</li>
                        </ul>
                    </div>
                </div>
                <SchoolMap :schools="schools" />
            </div>

            <div class="footer">
                <ul>
                    <li v-if="META.note" class="note"><em>Note: {{ META.note }}</em></li>
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