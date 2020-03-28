import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
// 通过原型的方式给vue添加总线事件
Vue.prototype.$bus = new Vue();
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
