<template>
  <v-sheet class="pa-2" rounded >
    <v-row v-for="(habit, index) in habits" :key="habit.id" class="row-list mb-2">
      <v-col cols="9">
        <div class="d-flex align-center">
          <v-icon color="primary">{{ habit.icon }}</v-icon>
          <div class="pl-2" v-if="editIndex !== index">
            <span class="body-1">{{ habit.name }}</span>
            <div class="caption text--secondary" v-if="habit.totalDays > 1">
              Dia {{ habit.dayNumber }} de {{ habit.totalDays }}
            </div>
          </div>
          <v-text-field
            class="ml-4"
            variant="plain"
            v-model="editName"
            v-if="editIndex === index"
            @keydown.enter="saveEdit(habit, index)"
            @blur="cancelEdit"
            autofocus
          ></v-text-field>
        </div>
      </v-col>

      <v-col cols="3">
        <div class="d-flex justify-end">
          <v-checkbox
            class="ma-0"
            color="primary"
            hide-details
            :input-value="habit.checked"
            @change="onCheckChange(habit, $event)"
          ></v-checkbox>
          <v-icon 
            role="button"
            aria-label="Editar hábito" 
            @click="startEdit(index)"
          >mdi-pencil</v-icon>
          <v-icon 
            role="button"
            aria-label="Deletar hábito"
            @click="onDeleteHabit(habit)"
          >mdi-delete</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  name: 'HabitApp',
  emits: [ 'check-habit', 'update-habit', 'delete-habit' ],
  props: {
    habits: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      editIndex: null,
      editName: ''
    }
  },
  methods: {
    onCheckChange(habit, checked) {
      this.$emit('check-habit', { id: habit.id, checked });
    },
    startEdit(index) {
      this.editIndex = index;
      this.editName = this.habits[index].name;
    },
    saveEdit(habit) {
      const updatedName = this.editName.trim();
      if (!updatedName) return;

      const habitCopy = { ...habit, name: updatedName };

      this.$emit('update-habit', habit.groupId ? {
        type: 'group',
        groupId: habit.groupId,
        data: { name: updatedName }
      } : { type: 'single', habit: habitCopy });

      this.editIndex = null;
      this.editName = '';
    },
    cancelEdit() {
      this.editIndex = null;
      this.editName = '';
    },
    onDeleteHabit(habit) {
      this.$emit('delete-habit', habit);
    }
  }
}
</script>

<style scoped>
.row-list {
  background-color: #f2f2f2;
  border-radius: 4px;
}
</style>