<template>
  <v-card class="center wrapper">
    <test v-if="1 == 0" />
    <test2 />
  </v-card>
</template>

<script>
import test from "../components/excels/bagrut-rewards-excel.vue";
import test2 from "../components/tables/bagrut-rewards-table.vue";

export default {
  name: "cutomizeTables",
  components: {
    test,
    test2,
  },
  data() {
    return {
      empId: 103103103,
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
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  /* border: 1px solid black; */
  overflow: hidden; /* will contain if #first is longer than #second */
}
</style>
