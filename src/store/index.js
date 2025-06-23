import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    habits: [],
    habitChecks: {},
  },
  getters: {
    allHabits: state => state.habits,
    isHabitChecked: (state) => (habitId, date) => {
      return !!(state.habitChecks[habitId] && state.habitChecks[habitId][date]);
    },
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
    },
    SET_HABIT_CHECK(state, { habitId, date, value }) {
      if (!state.habitChecks[habitId]) {
        Vue.set(state.habitChecks, habitId, {});
      }
      Vue.set(state.habitChecks[habitId], date, value);
      localStorage.setItem('habitChecks', JSON.stringify(state.habitChecks));
    },
    SET_HABIT_CHECKS(state, habitChecks) {
      state.habitChecks = habitChecks;
    },
  },
  actions: {
    loadHabits({ commit }) {
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      commit('SET_HABITS', habits);
      const habitChecks = JSON.parse(localStorage.getItem('habitChecks') || '{}');
      commit('SET_HABIT_CHECKS', habitChecks);
    },
    setHabitCheck({ commit }, { habitId, date, value }) {
      commit('SET_HABIT_CHECK', { habitId, date, value });
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
