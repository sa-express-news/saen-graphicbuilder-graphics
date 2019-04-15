import { hierarchy } from 'd3';

//components
import Chart from '../Chart/Chart.vue';

import buildTree from './buildTree';

import data from '../../../data.json';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data() {
        const { tree, farms, yco } = buildTree(data.TREE);
        return Object.assign({}, data, {
            width: 0,
            tree: hierarchy(tree),
            farms,
            yco,
        }); 
    },
    computed: {
        height() {
            return this.width * 0.8;
        },
        viewBoxString () {
            return `0 0 ${this.width} ${this.height}`
        },
    },
    methods: {
        commaSeparate(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        setWidth() {
            this.width = window.innerWidth > 960 ? 960 : window.innerWidth;
        },
    },
    mounted() {
        window.addEventListener('resize', this.setWidth);
        this.setWidth();
    },
    destroyed() {
        window.removeEventListener('resize', this.setWidth);
    },
    components: {
        Chart,
    }
}