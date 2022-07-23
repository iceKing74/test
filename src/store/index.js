import Vue from 'vue'
import Vuex from 'vuex'

// 导入vuex子模块
import admin from './modules/admin.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    collapsed: false
  },
  getters: {

  },
  modules: {
    admin
  },
  mutations: {
    ToggleMenu (state) {
      state.collapsed = !state.collapsed
    }
  },
  actions: {

  }
})

export default store
