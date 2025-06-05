<template>
  <v-sheet class="pa-4" rounded="xl" elevation="2">
    <v-slide-group
      v-model="selectedDate"
      show-arrows
      class="d-flex"
    >
      <v-slide-item
        v-for="(day, index) in days"
        :key="index"
        :value="day.date"
      >
        <v-chip
          :color="selectedDate && selectedDate.toDateString() === day.date.toDateString() ? 'primary' : 'white'"
          :class="{
            'selected-chip': selectedDate && selectedDate.toDateString() === day.date.toDateString()
          }"
          class="ma-2 pt-8 pb-8"
          @click="selectDate(day.date)"
        >
          <div class="d-flex flex-column">
            <div class="text-caption">{{ day.weekday }}</div>
            <v-progress-circular color="accent" model-value="80">
              <span
                class="progress-text"
                :class="{ 'selected-text': selectedDate && selectedDate.toDateString() === day.date.toDateString() }"
              >
                {{ day.date.getDate().toString().padStart(2, '0') }}
              </span>
            </v-progress-circular>
          </div>
        </v-chip>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
export default {
  name: 'WeekApp',
  data() {
    const today = new Date();
    return {
      selectedDate: today,
      days: this.generateDates(),
    }
  },
  methods: {
    generateDates() {
      const today = new Date();
      const days = [];
      for (let i = -2; i <= 10; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push({ date, weekday });
      }
      return days;
    },
    selectDate(date) {
      this.selectedDate = date;
    }
  },
}
</script>

<style scoped>
.v-slide-group {
  overflow-x: auto;
}

.progress-text {
  color: #424242;
  font-weight: bold;
  font-size: 16px;
  line-height: 40px;
}

.selected-text {
  color: #fff !important;
}
</style>