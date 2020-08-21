<template>
  <v-card class="center wrapper">
    <calcHoursTable />
  </v-card>
</template>

<script>
import calcHoursTable from "../components/calc-hours-table.vue";

export default {
  name: "employeeInfo",
  components: {
    calcHoursTable,
  },
  data() {
    return {
      empId: 103103103,
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
