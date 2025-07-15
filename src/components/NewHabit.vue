<template>
  <v-dialog v-model="localShow" max-width="500" scrollable>
    <v-card elevation="2">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">New Habit</span>
        <v-btn icon @click="closeDialog">
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
          :placeholder="dateNow"
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
            default: false,
            required: true
        }
    },
    data() {
        return {
            localShow: this.showNewHabit,
            habitDescription: '',
            habitIcone: '',
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
            this.habitIcone = value;
        },
        handleNewHabit() {
        if (this.habitDescription === '') {
            this.showAlert('Describe the habit before saving.', 'error');
            return;
        }

        if (this.habitStartDate < this.dateNow) {
            this.showAlert('The start date cannot be earlier than the current day!', 'error');
            return;
        }

        this.saveHabit({
            name: this.habitDescription,
            icon: this.habitIcone || 'mdi-water',
            checked: false,
            startDate: this.habitStartDate, 
            frequency: this.habitFrequency
        });

        this.showAlert('Habit saved successfully!', 'success');
        
        this.$emit('new-habit');
        this.habitDescription = '';
        this.habitStartDate = this.dateNow;
        this.habitFrequency = 1;
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