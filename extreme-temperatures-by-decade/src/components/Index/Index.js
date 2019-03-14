import Bar      from '../Bar/Bar.vue';
import Legend   from '../Legend/Legend.vue';

import data from '../../../data.json';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data() { return data },
    methods: {
        commaSeparate(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        getMax(station) {
            return this[station].reduce((max, { daytime_highs, nighttime_lows }) => {
                const highest = daytime_highs > nighttime_lows ? daytime_highs : nighttime_lows;
                return highest > max ? highest : max;
            }, 0);
        },
    },
    components: {
        'bar': Bar,
        'legends': Legend,
    }
}