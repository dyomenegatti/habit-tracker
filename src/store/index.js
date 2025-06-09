import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    habits: [],
  },
  getters: {
    habits: state => state.habits,
  },
  mutations: {
    'ADD_HABIT'(state, habit) {
      state.habits.push(habit);
      console.log('mutation', habit)
    },
  },
  actions: {
    createHabit({ commit }, habit) {
      console.log('action', habit);
      commit('ADD_HABIT', habit)
    },
  },
  modules: {
  }
})
