<template>
  <div>
    <h1>עובדים</h1>
    <HireEmployee id="myTable" class="center"/>
  </div>
</template>

<script>
import HireEmployee from "../components/tables/hire-employee.vue";
export default {
  name: "HireEmp",
  components: {
    HireEmployee,
  },
};
</script>
<style scoped>
h1 {
  text-align: center;
  justify-content: center;
  /* font-weight: bold; */
  text-decoration: underline;
}
#myTable {
  max-width: 60%;
}
</style>