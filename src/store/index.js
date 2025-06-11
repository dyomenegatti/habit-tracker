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
    UPDATE_HABIT(state, updatedHabit) {
      const index = state.habits.findIndex(item => item.id === updatedHabit.id);
      if (index !== -1) {
        Vue.set(state.habits, index, updatedHabit);
      }
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
      const index = state.habits.findIndex(item => item.id === habit.id);
      if (index !== -1) {
        commit('UPDATE_HABIT', habit);
      } else {
        let lastId = parseInt(localStorage.getItem('lastHabitId') || '0', 10);
        habit.id = lastId + 1;
        localStorage.setItem('lastHabitId', habit.id);
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
