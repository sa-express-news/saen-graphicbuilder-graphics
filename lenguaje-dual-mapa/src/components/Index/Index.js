import data from '../../../data.json';
import schools from '../../assets/bexar-schools.csv';

import SchoolMap from '../Map/Map.vue';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data() { return Object.assign({}, data, {
        onlyDualLanguage: window.innerWidth < 500,
    }) },
    computed: {
        schools() {
            return schools.filter(school => !this.onlyDualLanguage || school.isDualLanguage === 'True');
        }
    },
    methods: {
        commaSeparate(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        stringToClass(str) {
            return str.split(/\s+/g).join('-').toLowerCase();
        },
    },
    components: { SchoolMap }
}