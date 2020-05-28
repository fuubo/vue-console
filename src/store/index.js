import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: null,
  islogin: null,
  menu: null,
  systemUserMap: null,
  districts: null,
  clubs: null,
  activityCategories: null,
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})