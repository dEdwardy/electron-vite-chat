import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    loading: false,
  },
  getters: {
    loading: (state) => state.loading,
  },
  mutations: {},
  actions: {},
  modules: {},
  plugins: [createPersistedState()],
})
