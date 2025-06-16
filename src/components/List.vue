<template>
  <v-sheet class="pa-4 mt-2" rounded="xl" elevation="2">
    <v-row>
      <v-col cols="12" md="6">
        <div class="text-h6 font-weight-medium">Your habits</div>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="9">
        <div class="text-subtitle-2">In progress today ({{ inProgress }})</div>
      </v-col>
      <v-col cols="3">
        <div class="d-flex justify-end" v-if="!showNewHabit">
          <v-btn icon density="comfortable" color="white" class="custom-btn-bg" @click="showInputNewHabit">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <new-habit 
      :showNewHabit="showNewHabit"
      @new-habit="handleNewHabit"
    ></new-habit>

    <div class="mt-4">
      <Habit 
        :habits="habits"
        @check-habit="saveHabit"
        @update-habit="saveHabit"
        @delete-habit="deleteHabit"
      />

      <div  
        v-if="emptyHabits"
        justify="center" 
        align="center" 
        class="font-weight-thin font-italic"
      >
        Você ainda não adicionou nenhum hábito!
      </div>
    </div>

  </v-sheet>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Habit from './Habit.vue';
import NewHabit from './NewHabit.vue';

export default {
  name: 'ListApp',
  components: { Habit, NewHabit, },
  data() {
    return {
      showNewHabit: false,
    }
  },
  created() {
    this.loadHabits();
  },
  computed: {
    ...mapGetters([
      'allHabits',
    ]),
    habits() {
      return this.allHabits;
    },
    emptyHabits() {
      return Array.isArray(this.habits) && this.habits.length === 0;
    },
    inProgress() {
      const habitInProgress = this.habits.filter(item => item.checked === false).length
      
      return habitInProgress;
    }
  },
  methods: {
    ...mapActions([
      'loadHabits',
      'saveHabit',
    ]),
    showInputNewHabit() {
      this.showNewHabit = true;
    },
    handleNewHabit() {
      this.showNewHabit = false;
    },
    deleteHabit(habit) {
      this.$store.dispatch('deleteHabit', habit.id);
    }
  },
}
</script>

<style scoped>
.custom-btn-bg {
  background: #1976d2 !important;
}
</style>