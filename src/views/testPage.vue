<template>
  <v-card class="center wrapper">
    <test />
  </v-card>
</template>

<script>
import test from "../components/excels/bagrut-rewards-excel.vue";

export default {
  name: "testPage",
  components: {
    test,
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
