<template>
    <div>
        <div class="graphic">
            <hr class="border-top" />
            <h1>{{ META.graphic_title }}</h1>
            <p class="subtext">{{ META.prose }}</p>

            <div id="graphic-container">
                <svg :viewBox="viewBoxString">
                    <chart
                        :width="width"
                        :height="height"
                        :tree="tree"
                        :farms="farms"
                        :yco="yco"
                    />
                </svg>
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
                <hr class="border-bottom" />
            </div>
        </div>
    </div>
</template>

<script src="./Index.js"></script>
<style src="./Index.scss" lang="scss"></style>