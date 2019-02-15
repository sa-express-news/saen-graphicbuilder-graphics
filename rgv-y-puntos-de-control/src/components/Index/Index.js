import data from '../../../data.json';

import RgvMap from '../Map/Map.vue';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data: function () { return data; },
    methods: {
        commaSeparate: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    components: {
        RgvMap,
    },
    mounted() {
        // Enter your JS here!
    }
}