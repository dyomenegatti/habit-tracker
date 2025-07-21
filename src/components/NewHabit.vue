<template>
  <v-dialog v-model="localShow" max-width="500" scrollable>
    <v-card elevation="2">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">New Habit</span>
        <v-btn icon @click="closeDialog" aria-label="Close dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle>
        Add details about the habit you want to track. Click save when you're done.
      </v-card-subtitle>

      <v-card-text>
        <v-alert
            v-if="alertMessage"
            :type="alertType"
            dismissible
            dense
            class="mb-4"
        >
            {{ alertMessage }}
        </v-alert>

        <v-row align="center">
          <v-col cols="2" class="mb-8">
            <SelectIcon @selected-icon="onSelectedIcon" />
          </v-col>
          <v-col cols="10">
            <v-text-field
                outlined
                label="New Habit"
                placeholder="Type your new habit"
                variant="plain"
                v-model="habitDescription"
            />
          </v-col>
        </v-row>

        <v-text-field
          label="Start Date"
          v-model="habitStartDate"
          :min="dateNow"
          type="date"
          persistent-hint
          outlined
        />

        <v-select
          label="Frequency (days)"
          :items="frequencyOptions"
          v-model="habitFrequency"
          outlined
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="handleNewHabit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import SelectIcon from './SelectIcon.vue'

function getTodayDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
}

export default {
    name: 'NewHabit',
    components: { SelectIcon },
    emits: ['new-habit'],
    props: {
      showNewHabit: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        localShow: this.showNewHabit,
        habitDescription: '',
        habitIcon: '',
        habitStartDate: getTodayDate(),
        habitFrequency: 1,
        alertMessage: '',
        alertType: 'success'
      }
    },
    watch: {
      showNewHabit(val) {
        this.localShow = val;
      },
      localShow(val) {
        if(!val) {
          this.$emit('new-habit');
        }
      }
    },
    computed: {
      dateNow() {
        return getTodayDate();
      },
      frequencyOptions() {
        return Array.from({ length: 31 }, (_, i) => i + 1);
      }
    },
    methods: {
      ...mapActions([
        'saveHabit'
      ]),
      onSelectedIcon(value) {
        this.habitIcon = value;
      },
      handleNewHabit() {
        if (!this.habitDescription.trim()) {
          return this.showAlert('Describe the habit before saving.', 'error');
        }

        if (this.habitStartDate < this.dateNow) {
          return this.showAlert('The start date cannot be earlier than the current day!', 'error');
        }

        this.saveHabit({
          name: this.habitDescription.trim(),
          icon: this.habitIcon || 'mdi-water',
          checked: false,
          startDate: this.habitStartDate,
          frequency: this.habitFrequency
        });

        this.showAlert('Habit saved successfully!', 'success');
        this.resetForm();
        this.$emit('new-habit');
      },
      closeDialog() {
        this.localShow = false;
      },
      showAlert(message, type = 'success') {
        this.alertMessage = message;
        this.alertType = type;

        setTimeout(() => {
            this.alertMessage = '';
        }, 3000);
      },
      resetForm() {
        this.habitDescription = '';
        this.habitIcon = '';
        this.habitStartDate = this.dateNow;
        this.habitFrequency = 1;
      }
    },
}
</script>

<style scoped>
.custom-btn-bg {
  background: #ececec !important;
}

.custom-btn-bg:hover {
  background: #1976d2 !important;
  color: white !important;
}
</style>