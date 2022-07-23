import http from '@/utils/request.js'
export default {
  namespaced: true,
  state: {
    info: {}
  },
  mutations: {
    SavaInfo (state, info) {
      state.info = info
    }
  },
  actions: {
    GetInfo (ctx) {
      http.get('admin/info').then(res => {
        if (res.err > 0) {
          console.log(res.desc)
        } else {
          ctx.commit('SavaInfo', res.result)
        }
      })
    }
  }
}
