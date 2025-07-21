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
    getHabitsByGroup: (state) => (groupId) => {
      return state.habits.filter(habit => habit.groupId === groupId);
    },
    getUniqueHabitGroups: (state) => {
      const groups = {};
      state.habits.forEach(habit => {
        if (!groups[habit.groupId]) {
          groups[habit.groupId] = {
            groupId: habit.groupId,
            name: habit.name,
            description: habit.description,
            icon: habit.icon,
            color: habit.color,
            frequency: habit.frequency,
            startDate: habit.startDate,
            instances: []
          };
        }
        groups[habit.groupId].instances.push(habit);
      });
      return Object.values(groups);
    },
  },
  mutations: {
    SET_HABITS(state, habits) {
      state.habits = habits;
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
    ADD_HABIT(state, habit) {
      state.habits.push(habit);
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
    UPDATE_HABIT(state, updatedHabit) {
      const index = state.habits.findIndex(item => item.id === updatedHabit.id);
      if (index !== -1) {
        Vue.set(state.habits, index, updatedHabit);
        localStorage.setItem('habits', JSON.stringify(state.habits));
      }
    },
    DELETE_HABIT(state, id) {
      state.habits = state.habits.filter(item => item.id !== id);
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
    DELETE_HABIT_GROUP(state, groupId) {
      state.habits = state.habits.filter(item => {
        if (item.groupId === groupId) {
          if (state.habitChecks[item.id]) {
            Vue.delete(state.habitChecks, item.id);
          }
          return false;
        }
        return true;
      });
      localStorage.setItem('habits', JSON.stringify(state.habits));
      localStorage.setItem('habitChecks', JSON.stringify(state.habitChecks));
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
      localStorage.setItem('habitChecks', JSON.stringify(state.habitChecks));
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
      if (habit.id) {
        // Atualiza todas as instâncias do grupo do hábito
        const groupHabits = state.habits.filter(h => h.groupId === habit.groupId);
        groupHabits.forEach(groupHabit => {
          const updatedHabit = { 
            ...groupHabit,
            ...habit,
            id: groupHabit.id, // mantém id original da instância
            groupId: groupHabit.groupId,
            date: groupHabit.date,
            dayNumber: groupHabit.dayNumber
          };
          commit('UPDATE_HABIT', updatedHabit);
        });
      } else {
        // Cria novo grupo e instâncias de hábitos
        const lastId = Number(localStorage.getItem('lastHabitId') || 0);
        const lastGroupId = Number(localStorage.getItem('lastGroupId') || 0);
        const newGroupId = lastGroupId + 1;
        localStorage.setItem('lastGroupId', newGroupId);

        const startDate = new Date(habit.startDate || new Date());
        const frequency = Number(habit.frequency) || 1;

        for (let i = 0; i < frequency; i++) {
          const habitDate = new Date(startDate);
          habitDate.setDate(startDate.getDate() + i);

          const habitInstance = {
            ...habit,
            id: lastId + 1 + i,
            groupId: newGroupId,
            date: habitDate.toISOString().split('T')[0],
            dayNumber: i + 1,
            checked: false
          };

          commit('ADD_HABIT', habitInstance);
        }
        localStorage.setItem('lastHabitId', lastId + frequency);
      }
    },
    deleteHabit({ commit }, id) {
      commit('DELETE_HABIT', id);
    },
    deleteHabitGroup({ commit }, groupId) {
      commit('DELETE_HABIT_GROUP', groupId);
    },
    updateHabitGroup({ commit, state }, { groupId, updatedData }) {
      const groupHabits = state.habits.filter(h => h.groupId === groupId);

      groupHabits.forEach(habit => {
        const updatedHabit = { 
          ...habit,
          ...updatedData,
          id: habit.id,
          groupId: habit.groupId,
          date: habit.date,
          dayNumber: habit.dayNumber
        };
        commit('UPDATE_HABIT', updatedHabit);
      });
    },
  },
});