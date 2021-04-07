<template>
  <div>
    <setJobPercentage class="myTable center" />
  </div>
</template>

<script>
import setJobPercentage from "../components/tables/set-job-percent";
export default {
  name: "setJobPercent",
  components: {
    setJobPercentage,
  },
};
</script>

<style scoped>
/* .myTable {
  max-width: 60%;
} */
</style>