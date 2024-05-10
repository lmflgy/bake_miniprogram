import App from './App'
import Vue from 'vue'
import uView from 'uview-ui'
import store from './store'
import formatTime from './utils/formatTime.js'
import Http from './utils/http.js'
import mIcon from '@/components/icon/icon.vue'
import commonNavbar from '@/components/commonNavbar.vue'

import share from './common/share.js'
Vue.mixin(share) 

Vue.component('m-icon', mIcon)
Vue.component('commonNavbar', commonNavbar)
Vue.use(uView)

// Vue.prototype.globalIcon = 'http://wlw12.top/miniImg/'
Vue.prototype.$http = Http
Vue.prototype.formatTime = formatTime
Vue.prototype.$store = store

// Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
	store,
	share
})
app.$mount()
