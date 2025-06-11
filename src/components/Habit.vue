<template>
  <v-sheet class="pa-2" rounded >
    <v-row v-for="(habit, index) in habits" :key="index" class="row-list mb-2">
      <v-col cols="9">
        <div class="d-flex" justify="center" align="center">
          <v-icon color="primary">{{ habit.icon }}</v-icon>
          <span class="body-1 pl-2">{{ habit.name }}</span>
        </div>
      </v-col>

      <v-col cols="3">
        <div class="d-flex justify-end">
          <v-checkbox
            class="ma-0"
            color="primary"
            hide-details
            :input-value="habit.checked"
            @change="onCheckChange(habit, $event)"
          ></v-checkbox>
          <v-icon @click="onDeleteHabit(habit)">mdi-delete</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: 'HabitApp',
  emits: [ 'update-habit', 'delete-habit' ],
  props: {
    habits: {
      type: Array,
    }
  },
  methods: {
    onCheckChange(habit, checked) {
      this.$emit('update-habit', { ...habit, checked });
    },
    onDeleteHabit(habit) {
      this.$emit('delete-habit', habit);
    }
  }
}
</script>

<style scoped>
.row-list {
  background-color: #f2f2f2;
  border-radius: 4px;
}
</style>