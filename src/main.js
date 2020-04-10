import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from '@/api/request'
import * as filters from './utils/filter'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import uuid4 from 'uuid/v4'
import VueTailwind from 'vue-tailwind'

require('./styles/utils.scss')

Vue.prototype.$request = request
Vue.prototype.$uuid = uuid4

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueTailwind)

const errorHandler = (err, vm, info) => {
  if (err.response) {
    let status = err.response.status
    let errorTip = ''
    switch (status) {
      case 403:
        errorTip = '没有权限'
        break
      case 401:
        store.commit('SET_INFO', null)
        store.commit('SET_LOGIN_STATE', null)
        localStorage.clear();
        Vue.prototype.$router.replaceAll('/login')
        errorTip = '请重新登录'
        break
      case 404:
        errorTip = '咦，这个接口不存在哦'
        break
      case 502:
        errorTip = '系统上线中，请稍等几分钟~'
        break
      default:
        errorTip = '出错啦！' + info.error.message
    }
    if (info) {
      errorTip = info.errorHeader + errorTip
    }
    Vue.prototype.$message({
      showClose: true,
      message: errorTip,
      type: 'error'
    })
  } else if (err.request) {
    console.error(err.request)
  } else {
    if (err === 'cancel' || err === 'close') {
      console.log(err)
    } else {
      console.error('err', err)
      Vue.prototype.$message.error('出错了！' + err.message);
    }
  }
}

Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler

Vue.prototype.$moment = moment

Object.defineProperty(Vue.prototype, '$throw', { value: (error, vm, info) => errorHandler(error, vm, info) })
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
