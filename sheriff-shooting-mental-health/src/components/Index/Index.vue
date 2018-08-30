<template>
    <div>
        <div class="graphic">
            <h1>{{ META.graphic_title }}</h1>
            <p class="subtext">{{ META.prose }}</p>

            <main>
                <div id="graphic-container">
                    <wee-people v-if="CURR.type === 'weepeople'"
                        :total="CURR.people_total"
                        :focus="CURR.people_focus"
                        :capita="CURR.people_per_wee"
                        :color="CURR.color"
                        elID="weepeople"
                    />
                </div>

                <div id="prose">
                    <explination
                        graphic="ONE"
                        :prose="CURR.prose"
                    />

                    <explination
                        graphic="TWO"
                        :prose="CURR.prose"
                    />

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
            </main>
        </div>
    </div>
</template>

<script src="./Index.js"></script>
<style src="./Index.scss"></style>