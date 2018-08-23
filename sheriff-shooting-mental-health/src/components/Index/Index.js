import data from '../../../data.json';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data: function () { return data },
    methods: {
        commaSeparate: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    mounted() {
        // Enter your JS here!
    }
}