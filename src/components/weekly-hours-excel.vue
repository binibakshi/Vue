<template>
  <v-card class="wrapper">
    <v-card>
      <v-card-title>ייצוא לשכר</v-card-title>
      <v-row>
        <v-col cols="12" md="2">
          <v-autocomplete
            v-model="localMossadId"
            :items="mossadot"
            color="primary"
            hide-no-data
            hide-selected
            item-text="mossadName"
            item-value="mossadId"
            placeholder="חפש מוסד"
            prepend-icon="mdi-database-search"
          ></v-autocomplete>
        </v-col>
        <v-btn
          @click="createWeeklyHoursToMossad(localMossadId,datesRange.min,datesRange.max)"
          color="success"
        >ייצא לאקסל</v-btn>
        <v-btn @click="downloadDemoFile()" color="success">מבנה אקסל</v-btn>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
/* eslint-disable no-unused-vars */
import XLSX from "xlsx";
import axios from "axios";
import excelMixin from "../mixins/excelMixin";
const FRONTAL = 1;

export default {
  name: "WeeklyHoursExcel",
  data() {
    return {
      localMossadId: null,
      allEmpsInfo: null,
      codeDescription: [],
      datesRange: { min: "", max: "" },
      empsHours: [],
      dataToExport: [],
      mossadot: [],
    };
  },
  created() {
    this.getCodesDescription();
    this.getAllMossadot();
    this.setBegdaEndda();
  },
  mixins: [excelMixin],
  methods: {
    // async createWeeklyHoursToMossad() {
    //   await this.getAllEmpInfo(this.localMossadId);
    //   await this.getAllEmpHours(this.localMossadId);
    //   this.setWeeklyHoursAndExport(this.localMossadId);
    // },
    // async createWeeklyHoursToEmployee(empId) {
    //   await this.getEmpInfo(empId, this.localMossadId);
    //   await this.getEmpHours(empId, this.localMossadId);
    //   this.setWeeklyHoursAndExport(this.localMossadId);
    // },
    setBegdaEndda() {
      var currDate = new Date();
      var year = currDate.getFullYear();
      if (currDate.getMonth() >= 8) {
        year = currDate.getFullYear() + 1;
      }
      this.datesRange.min = this.FormatDate(new Date(year - 1, 8, 1));
      this.datesRange.max = this.FormatDate(new Date(year, 5, 20));
    },
    getAllMossadot() {
      axios
        .get("/mossadot/all")
        .then((response) => {
          this.mossadot = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    FormatDate(iDate) {
      var inputDate = new Date(iDate);
      var formattedDate;
      var year = inputDate.getFullYear();
      var month = 0;
      var day = 0;

      month += inputDate.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (inputDate.getDate() < 10) {
        day = "0";
      }
      day += inputDate.getDate();
      formattedDate = year + "-" + month + "-" + day;
      return formattedDate;
    },
  },
};
</script>

<style scoped>
input {
  border: 1px solid;
}
.giveSomeSpace {
  margin: 5px;
  margin-top: 15px;
  margin-right: 2%;
}
.btn {
  margin-right: 10px;
}
#myTable {
  max-width: 70%;
  margin-top: 5%;
  margin-right: 10%;
}
#btn {
  margin-right: 20px;
}
</style>
