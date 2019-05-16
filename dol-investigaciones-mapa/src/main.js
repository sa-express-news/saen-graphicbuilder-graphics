import Vue from 'vue'
import pym from 'pym.js'

import titleMixin from './mixins/titleMixin'

import Index from './components/Index/Index.vue'

Vue.mixin(titleMixin)

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
