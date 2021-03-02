<template>
  <v-card class="center wrapper">
    <v-row class="center"
      ><v-btn @click="handleExcelChange()">{{ excelButtomText }}</v-btn>
      <jobRewardsExcel v-show="showExcel" style="width: 50%"
    /></v-row>
    <jobRewardsTable />
  </v-card>
</template>

<script>
import jobRewardsExcel from "../components/excels/job-rewards-excel.vue";
import jobRewardsTable from "../components/customeTables/job-rewards-table.vue";

export default {
  name: "cutomizeTables",
  components: {
    jobRewardsExcel,
    jobRewardsTable,
  },
  data() {
    return {
      showExcel: false,
      excelButtomText: "הצג אקסל",
    };
  },
  methods: {
    handleExcelChange() {
      this.showExcel = !this.showExcel;
      this.excelButtomText = !this.showExcel ? "הצג אקסל" : "הסתר אקסל";
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  /* border: 1px solid black; */
  overflow: hidden; /* will contain if #first is longer than #second */
}
</style>
