/* eslint-disable vue/no-unused-components */
/* eslint-disable vue/no-unused-components */
<template>
    <v-card>
    <!-- <employeesTable/> -->
    <setEmployeesHours/>
    </v-card>
</template>

<script>
import setEmployeesHours from '../components/set-employees-hours.vue';
// import employeesTable from '../components/employees-table.vue';

export default {
    name :'employeeInfo',
    components: {
    setEmployeesHours,
    // employeesTable
  },
    data(){
        return{

        }
    }
}
</script>

<style lang="stylus" scoped></style>
