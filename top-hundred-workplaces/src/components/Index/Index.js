import data from '../../../data.json';

import SelectGroup  from '../SelectGroup/SelectGroup.vue';
import Table        from '../Table/Table.vue';

const getTitle = () => data && data.META
    && data.META.graphic_title ? data.META.graphic_title : 'Graphic';

export default {
    name: 'graphic',
    title: getTitle,
    data() {
        return { 
            groupKey: 'large',
            large: data.LARGE,
            medium: data.MEDIUM,
            small: data.SMALL,
            META: data.META,
        };
    },
    methods: {
        commaSeparate (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        selectGroup (group) {
            this.groupKey = group;
        },
        getTableItems () {
            return this[this.groupKey];
        },
    },
    components: {
        SelectGroup,
        Table,
    },
}