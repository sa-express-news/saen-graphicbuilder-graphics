import data from '../../../data.json';

import Topo from '../../assets/topo.svg';

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
        stringToClass(str) {
            return str.split(/\s+/g).join('-').toLowerCase();
        }
    },
    components: {
        Topo,
    },
}