<template>
    <v-row v-if="showNewHabit">
        <v-col cols="3">
            <SelectIcon></SelectIcon>
        </v-col>
        <v-col cols="6">
            <v-text-field
                label="Plain"
                placeholder="Placeholder"
                variant="plain"
            ></v-text-field>
        </v-col>
        <v-col cols="3">
            <v-btn icon density="comfortable" color="white" @click="handleNewHabit">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import SelectIcon from './SelectIcon.vue'

export default {
    name: 'NewHabit',
    components: { SelectIcon },
    props: {
        showNewHabit: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    methods: {
        handleNewHabit() {
            console.log('oi')
        }
    }
}
</script>