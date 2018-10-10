import tippy from 'tippy.js';

import data from '../../../data.json';

import Topo from '../../assets/topo.svg';

const getTitle = () => data && data.META && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data: function () { return data },
    methods: {
        commaSeparate: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        hydrateTooltip: function (id) {
            return `${id.replace(/\*+/g, ' ')}%`;
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
                    size: 'small',
                });
            }
        });
    },
}