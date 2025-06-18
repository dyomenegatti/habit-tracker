<template>
  <v-sheet class="pa-4" rounded="xl" elevation="2">
    <v-slide-group
      v-model="selectedDate"
      show-arrows
      class="d-flex"
      :active="currentDateIndex"
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
              <span
                class="progress-text"
                :class="{ 'selected-text': selectedDate && selectedDate.toDateString() === day.date.toDateString() }"
              >
                {{ day.date.getDate().toString().padStart(2, '0') }}
              </span>
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
    return {
      selectedDate: null,
      days: [],
    }
  },
  computed: {
    currentDateIndex() {
      return this.days.findIndex(
        d => d.date.toDateString() === this.selectedDate?.toDateString()
      );
    }
  },
  created() {
    const days = this.generateDates();
    const today = new Date();
    this.days = days;
    
    const todayObj = days.find(d => d.date.toDateString() === today.toDateString());
    this.selectedDate = todayObj ? todayObj.date : days[0]?.date;
  },
  methods: {
    generateDates() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth(); 
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const days = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        days.push({ date, weekday });
      }
      return days;
    },
    selectDate(date) {
      this.selectedDate = date;
      this.$emit('date-changed', date);
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