<template>
    <v-row v-if="showNewHabit" justify="center" align="start">
        <v-col cols="2" class="mt-1">
            <SelectIcon
                @selected-icon="onSelectedIcon"
            ></SelectIcon>
        </v-col>
        <v-col cols="8" class="pa-0">
            <v-text-field
                class="mt-4"
                label="New Habit"
                placeholder="Type your new habit"
                variant="plain"
                v-model="habitDescription"
            ></v-text-field>
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        label="Data Início"
                        :placeholder="dateNow"
                        :v-model="habitStartDate"
                        :min="dateNow"
                        type="date"
                        persistent-hint
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-select
                        label="Frequência (dias)"
                        :items="frequencyOptions"
                        v-model="habitFrequency"
                    ></v-select>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="2" class="mt-3">
            <v-btn icon density="comfortable" class="custom-btn-bg" @click="handleNewHabit">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-col>
    </v-row>
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
            habitDescription: '',
            habitIcone: '',
            habitStartDate: getTodayDate(),
            habitFrequency: 1
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
            if(this.habitStartDate < this.dateNow) {
                alert("A data de início não pode ser anterior ao dia atual!");
                return;
            }

            this.saveHabit({
                name: this.habitDescription,
                icon: this.habitIcone || 'mdi-water',
                checked: false,
                dataNow: this.habitStartDate,
                frequency: this.habitFrequency
            });
            this.$emit('new-habit');
            this.habitDescription = '';
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