import Vue from 'vue'
import Tooltip from 'vue-directive-tooltip';
import pym from 'pym.js'

import titleMixin from './mixins/titleMixin'

import Index from './components/Index/Index.vue'

Vue.use(Tooltip);

Vue.mixin(titleMixin)

Vue.config.productionTip = false

let pymChild;

const renderVue = () => new Vue({
  render: h => h(Index),
  mounted: () => {
    window.setTimeout(() => {
      if (pymChild) {
        pymChild.sendHeight();
      }
    },0);
  },
}).$mount('#app');

function load () {
    pymChild = new pym.Child({
        renderCallback: renderVue
    });
}

window.onload = load;
