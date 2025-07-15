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
    DELETE_HABIT_GROUP(state, groupId) {
      const habitsToDelete = state.habits.filter(item => item.groupId === groupId);
      
      habitsToDelete.forEach(habit => {
        if (state.habitChecks[habit.id]) {
          delete state.habitChecks[habit.id];
        }
      });
      
      state.habits = state.habits.filter(item => item.groupId !== groupId);
      
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
        const habitToUpdate = state.habits[index];
        const groupHabits = state.habits.filter(h => h.groupId === habitToUpdate.groupId);
        
        groupHabits.forEach(groupHabit => {
          const updatedHabit = { 
            ...habit, 
            id: groupHabit.id, 
            groupId: groupHabit.groupId,
            date: groupHabit.date 
          };
          commit('UPDATE_HABIT', updatedHabit);
        });
      } else {
        let lastId = parseInt(localStorage.getItem('lastHabitId') || '0', 10);
        let lastGroupId = parseInt(localStorage.getItem('lastGroupId') || '0', 10);
        
        const groupId = lastGroupId + 1;
        localStorage.setItem('lastGroupId', groupId);
        
        const startDate = new Date(habit.startDate || new Date());
        const frequency = parseInt(habit.frequency || 1);
        
        for (let i = 0; i < frequency; i++) {
          const habitDate = new Date(startDate);
          habitDate.setDate(startDate.getDate() + i);
          
          const habitInstance = {
            ...habit,
            id: lastId + 1 + i,
            groupId: groupId,
            date: habitDate.toISOString().split('T')[0], 
            dayNumber: i + 1
          };
          
          commit('ADD_HABIT', habitInstance);
        }
        
        localStorage.setItem('lastHabitId', lastId + frequency);
      }
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
    deleteHabit({ commit, state }, id) {
      commit('DELETE_HABIT', id);
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
    deleteHabitGroup({ commit, state }, groupId) {
      const habitsToDelete = state.habits.filter(habit => habit.groupId === groupId);
      habitsToDelete.forEach(habit => {
        if (state.habitChecks[habit.id]) {
          delete state.habitChecks[habit.id];
        }
      });
      
      commit('DELETE_HABIT_GROUP', groupId);
      localStorage.setItem('habits', JSON.stringify(state.habits));
      localStorage.setItem('habitChecks', JSON.stringify(state.habitChecks));
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
      
      localStorage.setItem('habits', JSON.stringify(state.habits));
    },
  },
})
