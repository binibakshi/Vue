<template>
  <div>
    <mossadotMenagement />
    <mossadHours />
  </div>
</template>

<script>
import mossadotMenagement from "../components/mossadot-menagement";
import mossadHours from "../components/mossadHours";
export default {
  name: "mossadot",
  components: {
    mossadotMenagement,
    mossadHours,
  },
};
</script>
<style scoped>
</style>