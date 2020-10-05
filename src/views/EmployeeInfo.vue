<template>
  <div>
    <setEmployeesHours />
  </div>
</template>

<script>
import setEmployeesHours from "../components/weeklyHours/set-employees-hours.vue";
// import employeesTable from '../components/employees-table.vue';

export default {
  name: "employeeInfo",
  components: {
    setEmployeesHours,
    // employeesTable
  },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
