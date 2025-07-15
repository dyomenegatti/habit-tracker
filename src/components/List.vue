<template>
  <v-sheet class="pa-4 mt-2" rounded="xl" elevation="2">
    <v-row>
      <v-col cols="12" md="6">
        <div class="text-h6 font-weight-medium" data-test="list_title">Your habits</div>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="9">
        <div class="text-subtitle-2">In progress today ({{ inProgress }})</div>
      </v-col>
      <v-col cols="3">
        <div class="d-flex justify-end">
          <v-btn icon density="comfortable" color="white" class="custom-btn-bg" @click="showInputNewHabit">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <New-habit 
      :showNewHabit="showNewHabit"
      @new-habit="handleNewHabit"
    ></New-habit>

    <div class="mt-4">
      <Habit 
        :habits="habits"
        @check-habit="onCheckHabit"
        @update-habit="onUpdateHabit"
        @delete-habit="deleteHabit"
      />

      <div  
        v-if="emptyHabits"
        justify="center" 
        align="center" 
        class="font-weight-thin font-italic"
      >
        You haven't added any habits yet!
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
  props: {
    selectedDate: {
      type: Date,
      required: true
    }
  },
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
      'isHabitChecked',
      'getUniqueHabitGroups',
    ]),
    habits() {
      return this.getUniqueHabitGroups
        .filter(group => {
          return group.instances.some(habit => {
            const selectedDateStr = this.selectedDate.toISOString().slice(0, 10);
            return habit.date === selectedDateStr;
          });
        })
        .map(group => {
          const todayInstance = group.instances.find(habit => {
            const selectedDateStr = this.selectedDate.toISOString().slice(0, 10);
            return habit.date === selectedDateStr;
          });
          
          return {
            ...group,
            id: todayInstance.id, 
            checked: this.isHabitChecked(todayInstance.id, this.selectedDate.toISOString().slice(0, 10)),
            dayNumber: todayInstance.dayNumber,
            totalDays: group.frequency
          };
        });
    },
    emptyHabits() {
      return this.habits.length === 0;
    },
    inProgress() {
      return this.habits.filter(h => !h.checked).length;
    }
  },
  methods: {
    ...mapActions([
      'loadHabits',
      'saveHabit',
      'updateHabitGroup',
      'deleteHabitGroup',
    ]),
    showInputNewHabit() {
      this.showNewHabit = true;
    },
    handleNewHabit() {
      this.showNewHabit = false;
    },
    deleteHabit(habit) {
      if (habit.groupId) {
        this.$store.dispatch('deleteHabitGroup', habit.groupId);
      } else {
        this.$store.dispatch('deleteHabit', habit.id);
      }
    },
    onCheckHabit({ id, checked }) {
      this.$store.dispatch('setHabitCheck', {
        habitId: id, 
        date: this.selectedDate.toISOString().slice(0, 10),
        value: checked
      });
    },
    onUpdateHabit(data) {
      if (data.type === 'group') {
        this.$store.dispatch('updateHabitGroup', {
          groupId: data.groupId,
          updatedData: data.data
        });
      } else {
        this.$store.dispatch('saveHabit', data.habit);
      }
    },
  },
}
</script>

<style scoped>
.custom-btn-bg {
  background: #1976d2 !important;
}
</style>