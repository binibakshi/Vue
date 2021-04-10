<template>
  <v-card>
    <v-card-title class="center">אקסלים לקליטה</v-card-title>
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
import hireEmpViaExcel from "../components/excels/hire-emp-via-excel";
import estimateJobPercent from "../components/excels/estimate-job-percent";
export default {
  name: "importExcels",
  components: {
    hireEmpViaExcel,
    estimateJobPercent,
  },
  data() {
    return {
      componentsOptions: [
        { text: "קליטת עובדים", value: "hireEmpViaExcel" },
        { text: "אחוזי קביעות משרה", value: "estimateJobPercent" },
      ],
      selectedComp: "",
    };
  },
};
</script>

<style scoped>
.selectExcel {
  max-width: 350px;
}
</style>