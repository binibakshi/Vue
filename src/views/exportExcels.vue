<template>
  <v-card>
    <v-card-title class="center">אקסלים לייצוא</v-card-title>
    <v-select
      class="selectExcel"
      :items="componentsOptions"
      v-model="selectedComp"
      label="בחר אקסל"
    ></v-select>
    <component v-bind:is="selectedComp" />
  </v-card>
</template>

<script>
import weeklyHoursExcel from "../components/excels/weekly-hours-excel";
import employeesExcel from "../components/excels/employees";
export default {
  name: "exportExcels",
  components: {
    weeklyHoursExcel,
    employeesExcel,
  },
  data() {
    return {
      componentsOptions: [],
      selectedComp: "",
    };
  },
  mounted() {
    this.initlize();
  },
  methods: {
    initlize() {
      if (this.$store.state.mossadId == 999) {
        this.componentsOptions = [
          { text: "איוש שעות", value: "weeklyHoursExcel" },
          { text: "עובדים", value: "employeesExcel" },
        ];
      } else {
        this.componentsOptions = [
          { text: "איוש שעות", value: "weeklyHoursExcel" },
        ];
      }
    },
  },
};
</script>

<style scoped>
.selectExcel {
  max-width: 350px;
}
</style>