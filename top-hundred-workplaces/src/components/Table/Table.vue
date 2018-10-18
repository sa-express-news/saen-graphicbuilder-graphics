<template>
    <b-container fluid class="table-wrapper">
    <!-- User Interface controls -->
        <b-row>
            <b-col md="6" class="my-1">
                <b-form-group horizontal class="mb-0 search">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Search for a company..." />
                        <b-input-group-append>
                            <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table 
            show-empty
            class="table table-striped"
            stacked="md"
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            @filtered="onFiltered"
        >
            <template slot="row-details" slot-scope="row">
                <b-card>
                    <ul>
                        <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
                    </ul>
                </b-card>
            </template>
        </b-table>

        <b-row>
            <b-col md="6" class="my-1">
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
            </b-col>
        </b-row>

        <!-- Info modal -->
        <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
            <pre>{{ modalInfo.content }}</pre>
        </b-modal>

    </b-container>
</template>

<script>
export default {
    name: 'data-table',
    data () {
        return {
            fields: [
                { key: 'Group rank', label: 'Rank', sortable: true, sortDirection: 'asc', 'class': 'text-center' },
                { key: 'Company name', label: 'Company', sortable: true, 'class': 'text-center' },
                { key: 'Sector', label: 'Sector', 'class': 'text-center' },
                { key: 'Year founded', label: 'Year founded', 'class': 'text-center' },
                { key: 'Interesting facts', label: 'Interesting facts', 'class': 'text-center' },
            ],
            currentPage: 1,
            perPage: 5,
            totalRows: this.items.length,
            pageOptions: [ 5, 10, 15 ],
            sortBy: null,
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            modalInfo: { title: '', content: '' },
        };
    },
    props: {
        items: {
            type: Array,
            required: true,
        },
        sendHeight: {
            type: Function,
            required: true,
        },
    },
    computed: {
        sortOptions () {
            // Create an options list from our fields
            return this.fields.filter(f => f.sortable).map(f => { 
                return { text: f.label, value: f.key } 
            });
        }
    },
    methods: {
        info (item, index, button) {
            this.modalInfo.title = `Row index: ${index}`;
            this.modalInfo.content = JSON.stringify(item, null, 2);
            this.$root.$emit('bv::show::modal', 'modalInfo', button);
        },
        resetModal () {
            this.modalInfo.title = '';
            this.modalInfo.content = '';
        },
        onFiltered (filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        }
    },
    updated() {
        this.sendHeight();
    },
}
</script>

<style lang="scss">
@import '~express-news-styleguide/init-base';

.table-wrapper.container-fluid {
    width: 100%;
    margin: 0 auto;
    font-size: .85rem;
    padding-left: 0;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;

    .search .form-row {
        display: block;

        &>[class*=col-] {
            padding-left: 0;
        }
    }

    .table {
        padding: 2em 0;
        max-width: 100%;
        width: 100%;

        th {
            font-weight: 700;
        }

        th,
        td {
            padding: .5rem;
            vertical-align: top;
            min-width: 70px;
        }

        tr:last-of-type {
            border-bottom: 1px solid #bdbdbd;
        }

        thead th {
            border-top: 0;
            text-align: left;
            vertical-align: bottom;
        }
    }

    .table-striped {

        tbody tr:nth-of-type(2n+1) {
            background-color: #f5f5f5;
        }
    }

    .pagination .page-item.active .page-link {
        background-color: $red;
        border-color: $red;
    }
}
</style>