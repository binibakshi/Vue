<template>
  <v-card class="importExcelWrapper">
    <v-card-title class="center">אקסלים לקליטה</v-card-title>
    <v-select
      class="selectExcel"
      :items="componentsOptions"
      v-model="selectedComp"
      label="בחר אקסל"
    ></v-select>
    <component class="importedExcelComp" v-bind:is="selectedComp" />
  </v-card>
</template>

<script>
import hireEmpViaExcel from "../components/excels/hire-emp-via-excel";
import estimateJobPercent from "../components/excels/estimate-job-percent";
import teacherHoursExcel from "../components/excels/teacher-hours-excel.vue";
export default {
  name: "importExcels",
  components: {
    hireEmpViaExcel,
    estimateJobPercent,
    teacherHoursExcel,
  },
  data() {
    return {
      componentsOptions: [],
      selectedComp: "",
    };
  },
  created() {
    this.initilize();
  },
  methods: {
    initilize() {
      if (this.$store.state.mossadId == 999) {
        this.componentsOptions = [
          { text: "קליטת עובדים", value: "hireEmpViaExcel" },
          { text: "אחוזי קביעות משרה", value: "estimateJobPercent" },
          { text: "קליטת מבנה שעות שבועיות", value: "teacherHoursExcel" },
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
.importedExcelComp {
  margin-top: 2%;
}
.importExcelWrapper {
  padding: 3%;
}
</style>