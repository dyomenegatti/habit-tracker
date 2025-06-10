import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    habits: [],
  },
  getters: {
    allHabits: state => state.habits,
  },
  mutations: {
    SET_HABITS(state, habits) {
      state.habits = habits;
    },
    ADD_HABIT(state, habit) {
      state.habits.push(habit);
    },
    UPDATE_HABIT(state, updated) {
      const index = state.habits.findIndex(item => item.id === updated.id);
      if(index !== -1) state.habits.slice(index, 1, updated);
    },
    DELETE_HABIT(state, id) {
      state.habits = state.habits.filter(item => item.id !== id);
    }
  },
  actions: {
    loadHabits({ commit }) {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      commit('SET_HABITS', habits);
    },
    saveHabit({ commit, state }, habit) {
      if(habit.id) {
        commit('UPDATE_HABIT', habit);
      } else {
        habit.id = Date.now();
        commit('ADD_HABIT', habit);
      }
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
    deleteHabit({ commit, state }, id) {
      commit('DELETE_HABIT', id);
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
  },
})
