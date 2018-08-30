import WeePeople    from '../WeePeople/WeePeople.vue';
import Explination  from '../Explination/Explination.vue';

// main data source
import data from '../../../data.json';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data: function () { return Object.assign({}, data, { 
        currentGraphic: 'ONE', 
        graphicHeight: 0,
    })},
    computed: {
        CURR() {
            return data[this.currentGraphic];
        },
    },
    methods: {
        commaSeparate: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    components: {
        'wee-people': WeePeople,
        'explination': Explination,
    },
}