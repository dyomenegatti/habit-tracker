<template>
  <v-sheet class="pa-2" rounded color="secondary">
    <v-row>
      <v-col cols="9">
        <div class="d-flex" justify="center" align="center">
          <v-icon color="primary">mdi-water</v-icon>
          <span class="body-1 pl-2">Drink water</span>
        </div>
      </v-col>

      <v-col cols="3">
        <div class="d-flex justify-end">
          <v-checkbox
            class="ma-0"
            v-model="habit"
            color="primary"
            hide-details
          ></v-checkbox>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: 'HabitApp',
  data() {
    return {
      habit: ''
    }
  }
}
</script>