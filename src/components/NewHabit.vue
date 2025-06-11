<template>
    <v-row v-if="showNewHabit" justify="center" align="center">
        <v-col cols="2">
            <SelectIcon
                @selected-icon="onSelectedIcon"
            ></SelectIcon>
        </v-col>
        <v-col cols="8">
            <v-text-field
                class="mt-4"
                label="New Habit"
                placeholder="Type your new habit"
                variant="plain"
                v-model="habitDescription"
            ></v-text-field>
        </v-col>
        <v-col cols="2">
            <v-btn icon density="comfortable" class="custom-btn-bg" @click="handleNewHabit">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import SelectIcon from './SelectIcon.vue'

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
            this.saveHabit({
                name: this.habitDescription,
                icon: this.habitIcone,
                checked: false
            });
            this.$emit('new-habit');
            this.habitDescription = '';
        }
    }
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