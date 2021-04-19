<template>
  <div>
    <component v-bind:is="componentInstance"></component>
  </div>
</template>

<script>
import reportBagrutRewards from "../components/reports/report-bagrutRewrds.vue";
import reportJobRewards from "../components/reports/report-jobRewards.vue";
import reportWeeklyHours from "../components/reports/report-weeklyHours.vue";
import reportRewardGaps from "../components/reports/report-rewardHoursGaps.vue";
import reportJobPercentGaps from "../components/reports/report-jobPercentGaps";
import reporstTeacherHoursGaps from "../components/reports/report-hoursGaps.vue";
export default {
  name: "report",
  components: {
    reportBagrutRewards,
    reportJobRewards,
    reportWeeklyHours,
    reportRewardGaps,
    reportJobPercentGaps,
    reporstTeacherHoursGaps,
  },
  data() {
    return {
      componentName: this.$route.params.id,
    };
  },
  computed: {
    componentInstance() {
      return this.$route.params.id;
    },
  },
};
</script>

<style scoped>
</style>