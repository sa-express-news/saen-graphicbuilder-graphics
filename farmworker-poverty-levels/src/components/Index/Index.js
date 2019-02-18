import Bar from '../Bar/Bar.vue';

import data from '../../../data.json';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data() { return data },
    computed: {
        maxPercent() {
            return this.POVERTY.reduce((max, { percent }) => percent > max ? percent : max, 0);
        },
    },
    methods: {
        commaSeparate(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        stringToClass(str) {
            return str.split(/\s+/g).join('-').toLowerCase();
        },
    },
    components: {
        'bar': Bar,
    }
}