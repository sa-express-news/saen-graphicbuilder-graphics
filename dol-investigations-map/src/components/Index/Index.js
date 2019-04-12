import tippy from 'tippy.js';

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
        },
        hydrateTooltip: function (id) {
            return `${id.replace(/\*+/g, ' ')} investigations`;
        },
    },
    components: {
        Topo,
    },
    mounted() {
        document.querySelectorAll('svg.map path').forEach(path => {
            if (path.id) {
                tippy(path, { 
                    content: this.hydrateTooltip(path.id),
                    delay: 100,
                    arrow: true,
                    arrowType: 'round',
                    size: 'large',
                    duration: 500,
                    animation: 'scale'
                });
            }
        });
    },
}