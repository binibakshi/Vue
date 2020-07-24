<template>
  <v-card class="wrapper" background-color="#ffffe6">
    <v-card-title primary-title>ניהול מוסדות</v-card-title>

    <v-row>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="mossadInfo"
          :items="mossadot"
          color="primary"
          hide-no-data
          hide-selected
          item-text="mossadName"
          item-value="mossadId"
          placeholder="חפש מוסד"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2" v-if="mossadInfo.mossadId != undefined">
        <h4 class="centerize">קוד מוסד - {{mossadInfo.mossadId}}</h4>
      </v-col>
      <v-btn color="success" class="centerize" @click="createMossad()">צור מוסד</v-btn>
      <v-btn color="success" class="centerize" @click="onexport()">ייצא לאקסל</v-btn>
    </v-row>
    <mosssadDetails v-if="mossadInfo != null" :mossadInfo="mossadInfo" />
    <createMossad v-if="isNew == true && mossadInfo.mossadId == undefined" />
  </v-card>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
import mosssadDetails from "./mossad-details";
import createMossad from "./create-mossad";

export default {
  name: "mosssadotMenagement",
  components: {
    mosssadDetails,
    createMossad,
  },

  data() {
    return {
      isNew: false,
      mossadInfo: {},
      mossadot: [],
    };
  },
  created() {
    this.getAllMossadot();
  },
  computed: {
    _mossadotName() {
      return this.mossadot.map((el) => el.mossadName);
    },
  },
  methods: {
    getAllMossadot() {
      axios.defaults.headers["Authorization"] =
        "Bearer" + this.$store.state.token;

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
    createMossad() {
      this.isNew = true;
      this.mossadInfo = {};
    },
    onexport() {
      // On Click Excel download button
      var temp = this.mossadot;
      temp.unshift({
        mossadId: "קוד מוסד",
        mossadName: "שם מוסד",
        mossadType: "סוג מוסד",
        maxHours: "מקסימום שעות",
        currHours: "שעות בפועל",
      });
      // export json to Worksheet of Excel
      // only array possible
      var mossadotWs = XLSX.utils.json_to_sheet(temp, {
        skipHeader: true,
        Views: [{ RTL: true }],
      });
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel'

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, mossadotWs, "מוסדות"); // sheetAName is name of Worksheet
      this.set_right_to_left(wb);

      // export Excel file
      XLSX.writeFile(wb, "מוסדות.xlsx"); // name of the file is 'book.xlsx'
    },

    set_right_to_left(wb /*:Workbook*/) {
      if (!wb.Workbook) wb.Workbook = {};
      if (!wb.Workbook.Views) wb.Workbook.Views = [];
      if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
      wb.Workbook.Views[0].RTL = true;
    },
  },
};
</script>

<style scoped>
p {
  text-align: center;
  text-decoration: underline;
  font-weight: bold;
}
.wrapper {
  background-color: #ffffe6;
  margin-right: 150px;
  margin-top: 50px;
  max-width: 60%;
  margin-bottom: 5%;
}
</style>