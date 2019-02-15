<template>
    <div>
        <div class="graphic">
            <h1>{{ META.graphic_title }}</h1>
            <p class="subtext">{{ META.prose }}</p>

            <div id="graphic-container">
                <RgvMap />
            </div>

            <div class="footer">
                <ul>
                    <li v-if="META.note" class="note">*{{ META.note }}</li>
                    <li v-if="META.source">Fuente:&nbsp;
                        <a v-if="META.source_url" :href="META.source_url">{{ META.source }}</a>
                        <span v-else>{{ META.source }}</span>
                    </li>
                    <li v-if="META.credit">Crédito: {{ META.credit }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script src="./Index.js"></script>
<style src="./Index.scss"></style>