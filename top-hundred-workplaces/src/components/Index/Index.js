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
            perPage: 10,
            large: data.LARGE,
            medium: data.MEDIUM,
            small: data.SMALL,
            META: data.META,
        };
    },
    methods: {
        commaSeparate(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        formatTableData(data) {
            return JSON.stringify({
                pagination: {
                    total: data.length,
                    per_page: this.perPage,
                    current_page: 1,
                    last_page: Math.ceil(data.length / this.perPage),
                    next_page_url: null,
                    prev_page_url: null,
                    from: 1,
                    to: this.perPage,
                },
                data,
            });
        },
        selectGroup(group) {
            this.groupKey = group;
        },
        getTableData() {
            return this[this.groupKey];
        },
    },
    components: {
        SelectGroup,
        Table,
    },
}