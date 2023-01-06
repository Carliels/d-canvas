import Vue from 'vue'
import App from './App.vue'
import './assets/styles/icofont.min.css'
import './assets/styles/d-canvas.scss'

Vue.config.productionTip = false

Vue.directive('autofocus', {
  inserted: function(el) {
      // console.log(el, binding)
      el.focus()
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
