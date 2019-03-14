<template>
    <div>
        <div class="graphic">
            <h1>{{ META.graphic_title }}</h1>
            <p class="subtext">{{ META.prose }}</p>

            <div id="graphic-container">
                <div id="san-antonio" class="wrapper left">
                    <legends />
                    <div class="bar-chart">
                        <bar
                            v-for="(data, idx) in SA"
                            class="chart-row"
                            :key="idx"
                            :last="idx === data.length - 1"
                            :decade="data.decade"
                            :name="data.name"
                            :highs="data.daytime_highs"
                            :lows="data.nighttime_lows"
                            :getMax="getMax"
                        />
                    </div>
                    <div class="desc">San Antonio</div>
                </div>
                <div id="llano" class="wrapper right">
                    <legends />
                    <div class="bar-chart">
                        <bar
                            v-for="(data, idx) in LLANO"
                            class="chart-row"
                            :key="idx"
                            :last="idx === data.length - 1"
                            :decade="data.decade"
                            :name="data.name"
                            :highs="data.daytime_highs"
                            :lows="data.nighttime_lows"
                            :getMax="getMax"
                        />
                    </div>
                    <div class="desc">Llano</div>
                </div>
                <div id="boerne" class="wrapper left">
                    <legends />
                    <div class="bar-chart">
                        <bar
                            v-for="(data, idx) in BOERNE"
                            class="chart-row"
                            :key="idx"
                            :last="idx === data.length - 1"
                            :decade="data.decade"
                            :name="data.name"
                            :highs="data.daytime_highs"
                            :lows="data.nighttime_lows"
                            :getMax="getMax"
                        />
                    </div>
                    <div class="desc">Boerne</div>
                </div>
                <div id="luling" class="wrapper right">
                    <legends />
                    <div class="bar-chart">
                        <bar
                            v-for="(data, idx) in LULING"
                            class="chart-row"
                            :key="idx"
                            :last="idx === data.length - 1"
                            :decade="data.decade"
                            :name="data.name"
                            :highs="data.daytime_highs"
                            :lows="data.nighttime_lows"
                            :getMax="getMax"
                        />
                    </div>
                    <div class="desc">Luling</div>
                </div>
                <div id="south" class="wrapper">
                    <legends />
                    <div class="bar-chart">
                        <bar
                            v-for="(data, idx) in SOUTH"
                            class="chart-row"
                            :key="idx"
                            :last="idx === data.length - 1"
                            :decade="data.decade"
                            :name="data.name"
                            :highs="data.daytime_highs"
                            :lows="data.nighttime_lows"
                            :getMax="getMax"
                        />
                    </div>
                    <div class="desc">The South</div>
                </div>
                <div id="us" class="wrapper">
                    <legends />
                    <div class="bar-chart">
                        <bar
                            v-for="(data, idx) in US"
                            class="chart-row"
                            :key="idx"
                            :last="idx === data.length - 1"
                            :decade="data.decade"
                            :name="data.name"
                            :highs="data.daytime_highs"
                            :lows="data.nighttime_lows"
                            :getMax="getMax"
                        />
                    </div>
                    <div class="desc">Nationwide</div>
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