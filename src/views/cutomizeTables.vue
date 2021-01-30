<template>
  <v-card class="center wrapper">
    <v-row class="center"
      ><v-btn @click="handleExcelChange()">{{ excelButtomText }}</v-btn>
      <bagrutRewardsExcel v-show="showExcel" style="width: 50%"
    /></v-row>
    <bagrutRewardsTable />
  </v-card>
</template>

<script>
import bagrutRewardsExcel from "../components/excels/bagrut-rewards-excel.vue";
import bagrutRewardsTable from "../components/tables/bagrut-rewards-table.vue";

export default {
  name: "cutomizeTables",
  components: {
    bagrutRewardsExcel,
    bagrutRewardsTable,
  },
  data() {
    return {
      empId: 103103103,
      showExcel: false,
      excelButtomText: "הצג אקסל",
      additionalrewardsHeaders: [
        { text: "מקצוע", value: "profession" },
        { text: 'יח"ל', value: "studyUnits" },
        { text: "שאלון", value: "questionnaire" },
        { text: "פנימי/חיצוני", value: "external" },
        { text: "גמול שעות", value: "hoursReward" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
      structure: {
        profession: null,
        studyUnits: null,
        questionnaire: null,
        external: null,
        hoursReward: null,
      },
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
