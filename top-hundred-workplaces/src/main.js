import Vue          from 'vue'
import BootstrapVue from 'bootstrap-vue'
import pym          from 'pym.js'

import titleMixin from './mixins/titleMixin'

import Index from './components/Index/Index.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.mixin(titleMixin);
Vue.use(BootstrapVue);

Vue.config.productionTip = false

let pymChild;

const renderVue = () => new Vue({
  render: h => h(Index),
  mounted: () => {
    if (pymChild) {
        pymChild.sendHeight();
    }
  },
}).$mount('#app');

function load () {
    pymChild = new pym.Child({
        renderCallback: renderVue
    });
}

window.onload = load;
