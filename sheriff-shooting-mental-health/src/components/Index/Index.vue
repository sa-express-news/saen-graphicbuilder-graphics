<template>
    <div>
        <div class="graphic">
            <div class="header">
                <h1>{{ META.graphic_title }}</h1>
                <p class="subtext">{{ META.prose }}</p>
            </div>

            <main>
                <div id="graphic-container">
                    <wee-people v-if="CURR.type === 'weepeople'"
                        :total="CURR.people_total"
                        :focus="CURR.people_focus"
                        :capita="CURR.people_per_wee"
                        :color="CURR.color"
                        :curr="currentGraphic"
                        elID="weepeople"
                    />
                </div>

                <div id="prose">
                    <explination
                        graphic="ONE"
                        :prose="ONE.prose"
                        :curr="currentGraphic"
                        @update-current="updateCurrentModal"
                    />

                    <explination
                        graphic="TWO"
                        :prose="TWO.prose"
                        :curr="currentGraphic"
                        @update-current="updateCurrentModal"
                    />

                     <explination
                        graphic="THREE"
                        :prose="THREE.prose"
                        :curr="currentGraphic"
                        @update-current="updateCurrentModal"
                    />

                    <explination
                        graphic="FOUR"
                        :prose="FOUR.prose"
                        :curr="currentGraphic"
                        @update-current="updateCurrentModal"
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