<template>
  
    <v-card>
      <v-card-title>
        Employees
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="employees"
        :items-per-page="5"
        class="elevation-1"
      ></v-data-table>
    </v-card>
</template>

<script>
// @ is an alias to /src

import axios from "axios";

export default {
  name: "employeesTable",

  components: {},
  data() {
    return {
      search: "",
      employees: [],
      headers: [
        {
          text: "Id ",
          align: "start",
          sortable: false,
          value: "id"
        },
        { text: "first name", value: "firstName" },
        { text: "last name", value: "lastName" },
        { text: "birth date", value: "birthDate" },
        { text: "is mother", value: "mother" },
        { text: "gender", value: "gender" }
      ]
    };
  },
  methods: {
    fetchData() {
      axios
        .get("/employees/all")
        .then(response => {
          this.employees = response.data;
        })
        .catch(error => console.log(error));
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
