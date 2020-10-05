<template>
  <div>
    <v-row class="center">
      <v-col cols="12" md="3">
        <v-autocomplete
          class="myMaxWindth"
          v-model="reformType"
          :items="reformTable"
          hide-selected
          item-text="name"
          item-value="reformId"
          label="רפורמה"
          placeholder="בחר"
          @change="filterTable()"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          class="myMaxWindth"
          v-model="ageHours"
          :items="ageHoursTable"
          hide-selected
          item-text="text"
          item-value="value"
          label="שעות גיל"
          placeholder="בחר"
          @change="filterTable()"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          class="myMaxWindth"
          v-model="isMother"
          :items="isMotherTable"
          hide-selected
          item-text="text"
          item-value="value"
          label="משרת אם"
          placeholder="בחר"
          @change="filterTable()"
        ></v-autocomplete>
      </v-col>

      <v-btn
        v-if="dataToTable.length > 0"
        color="success"
        @click="exportCalcHoursToExcel()"
        >ייצוא לאקסל</v-btn
      >
      <a href="https://tlush.edu.gov.il/calculators/" target="_blank"
        >סימולטור שכר</a
      >
    </v-row>

    <v-data-table
      v-if="dataToTable.length > 0"
      dense
      id="myTable"
      item
      :headers="headers"
      :items="dataToTable"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      class="elevation-1 center"
    >
      <template v-slot:[`item.jobPercent`]="{ item }">
        <p>{{ item.jobPercent }}</p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";
export default {
  name: "calcHoursTable",
  data() {
    return {
      headers: [],
      excelHeaders: [],
      reformType: "",
      ageHours: "",
      isMother: "",
      reformTable: [],
      ageHoursTable: [],
      isMotherTable: [],
      empCodesTable: [],
      dataToTable: [],
    };
  },

  created() {
    this.initilizer();
    this.getReforms();
    this.getEmploymentcodes();
  },
  methods: {
    initilizer() {
      this.headers = [
        { text: "שעות גיל", value: "ageHours" },
        { text: "משרת אם", value: "mother" },
        { text: "שעות פרונטליות", value: "frontalHours" },
        { text: "שעות שהייה", value: "pauseHours" },
        { text: "שעות פרטניות", value: "privateHours" },
        { text: "אחוז משרה", value: "jobPercent" },
      ];
      this.excelHeaders = {
        ageHours: "שעות גיל",
        mother: "משרת אם",
        frontalHours: "שעות פרונטליות",
        pauseHours: "שעות שהייה",
        privateHours: "שעות פרטניות",
        jobPercent: "אחוז משרה",
      };
      this.ageHoursTable = [
        { text: "הכל", value: "" },
        { text: "0", value: "0" },
        { text: "2", value: "2" },
        { text: "4", value: "4" },
      ];
      this.isMotherTable = [
        { text: "הכל", value: null },
        { text: "כן", value: true },
        { text: "לא", value: false },
      ];
    },
    getReforms() {
      axios
        .get("/reformTypes/all")
        .then(
          (response) =>
            (this.reformTable = response.data.filter(
              (el) => el.reformId == 1 || el.reformId == 2 || el.reformId == 5
            ))
        );
    },
    getEmploymentcodes() {
      axios.get("/calcHours/all").then((response) => {
        this.empCodesTable = response.data;
      });
    },
    filterTable() {
      this.dataToTable = [];
      this.empCodesTable.forEach((el) => {
        if (
          (el.reformType == this.reformType || this.reformType == null) &&
          (el.mother == this.isMother || this.isMother == null) &&
          (el.ageHours == this.ageHours || this.ageHours == "")
        ) {
          this.dataToTable.push({
            ageHours: el.ageHours,
            mother: this.formatMotherType(el.mother),
            frontalHours: el.frontalHours,
            pauseHours: el.pauseHours,
            privateHours: el.privateHours,
            jobPercent: el.jobPercent + "%",
          });
        }
      });
    },
    formatMotherType(mother) {
      if (mother == true) {
        return "כן";
      }
      return "לא";
    },
    exportCalcHoursToExcel() {
      this.downloadFile(
        this.dataToTable,
        this.excelHeaders,
        "פיצול שעות.xlsx",
        "פיצול שעות"
      );
    },
    downloadDemoFile() {
      var emptyForDemo = [];
      this.downloadFile(
        emptyForDemo,
        this.excelHeaders,
        "פיצול שעות.xlsx",
        "פיצול שעות"
      );
    },
    downloadFile(dataToExport, headers, excelName, sheetName) {
      var temp = dataToExport;
      temp.unshift(headers);
      var calcHoursWs = XLSX.utils.json_to_sheet(temp, {
        skipHeader: true,
        Views: [{ RTL: true }],
      });

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel'
      XLSX.utils.book_append_sheet(wb, calcHoursWs, sheetName);
      this.set_right_to_left(wb);

      // export Excel file
      XLSX.writeFile(wb, excelName);
    },

    set_right_to_left(wb /*:Workbook*/) {
      if (!wb.Workbook) wb.Workbook = {};
      if (!wb.Workbook.Views) wb.Workbook.Views = [];
      if (!wb.Workbook.Views[0])
        (wb.Workbook.Views[0] = {}), (wb.Workbook.Views[0].RTL = true);
    },
  },
};
</script>

<style scoped>
#serchReform {
  max-width: 400px;
}
#myTable {
  max-width: 80%;
}
.myMaxWindth {
  max-width: 250px;
}
p {
  font-weight: bold;
}
</style>