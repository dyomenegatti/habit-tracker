<template>
  <v-sheet class="pa-4 mt-2" rounded="xl" elevation="2">
    <v-row>
      <v-col cols="12" md="6">
        <div class="text-h6 font-weight-medium">Your habits</div>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="9">
        <div class="text-subtitle-2">In progress today (1)</div>
      </v-col>
      <v-col cols="3">
        <div class="d-flex justify-end">
          <v-btn icon density="comfortable" color="white" class="custom-btn-bg" @click="handleNewHabit">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <new-habit :showNewHabit="showNewHabit"></new-habit>

    <div class="mt-4">
      <Habit />
    </div>

  </v-sheet>
</template>

<script>
import Habit from './Habit.vue';
import NewHabit from './NewHabit.vue';

export default {
  name: 'ListApp',
  components: { Habit, NewHabit, },
  data() {
    return {
      showNewHabit: true,
    }
  },
  methods: {
    handleNewHabit() {
      this.showNewHabit = true;
    },
  },
}
</script>

<style scoped>
.custom-btn-bg {
  background: #1976d2 !important;
}
</style>