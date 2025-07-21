<template>
  <v-app>
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="12" md="6">
          <Header />
          <div class="d-flex flex-column ga-6">
            <Week 
              :selectedDate="selectedDate"
              @date-changed="selectedDate = $event"
            />
            <HabitsPanel :selectedDate="selectedDate" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Header from './components/Header.vue';
import Week from './components/Week.vue';
import HabitsPanel from './components/List.vue';

export default {
  name: 'App',
  components: { Header, Week, HabitsPanel, },
  data() {
    return {
      selectedDate: new Date(),
    }
  },
};
</script>
