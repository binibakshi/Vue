<template>
  <v-card class="wrapper">
    <v-card>
      <v-card-title>אקסל גמול תפקיד</v-card-title>
      <v-row class="giveSomeSpace">
        <input type="file" id="file" ref="file" @change="loadFile" />
        <v-btn
          v-if="jobRewardsTable != null"
          id="btn"
          color="primary"
          dark
          dense
          @click="saveAll()"
          >שמור הכל</v-btn
        >
        <v-btn color="primary" dark dense @click="downloadDemoFile()"
          >מבנה אקסל</v-btn
        >
        <div v-if="jobRewardsTable.length > 0">
          <v-data-table
            dense
            id="myTable"
            :headers="headers"
            :items="jobRewardsTable"
            :items-per-page="50"
            class="elevation-1"
          >
            <template v-slot:[`item.internalHoursReward`]="{ item }">{{
              getTwoDigits(item.internalHoursReward)
            }}</template>
            <template v-slot:[`item.externalPercentReward`]="{ item }"
              >{{ getTwoDigits(item.externalPercentReward) }}%</template
            >
            <template v-slot:[`item.externalHoursReward`]="{ item }">{{
              getTwoDigits(item.externalHoursReward)
            }}</template>
            <template v-slot:[`item.internalPercentReward`]="{ item }"
              >{{ getTwoDigits(item.internalPercentReward) }}%</template
            >
          </v-data-table>
        </div>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";

export default {
  data() {
    return {
      file: null,
      headers: [
        { text: "קוד מקצוע", value: "employmentCode" },
        { text: "תיאור", value: "description" },
        { text: "מינימום שעות", value: "minHours" },
        { text: "מקסימום שעות", value: "maxHours" },
        { text: "אחוזים1", value: "percent1" },
        { text: "אחוזים2", value: "percent2" },
        { text: "אחוזים3", value: "percent3" },
        { text: "אחוזים4", value: "percent4" },
        { text: "אחוזים5", value: "percent5" },
        { text: "מינימום אחוזים", value: "minPercent" },
        { text: "מקסימום אחוזים", value: "maxPercent" },
        { text: "קישור", value: "descLink" },
      ],
      excelHeaders: {
        employmentCode: "קוד מקצוע",
        description: "תיאור",
        minHours: "מינימום שעות",
        maxHours: "מקסימום שעות",
        percent1: "אחוזים1",
        percent2: "אחוזים2",
        percent3: "אחוזים3",
        percent4: "אחוזים4",
        percent5: "אחוזים5",
        minPercent: "מינימום אחוזים",
        maxPercent: "מקסימום אחוזים",
        descLink: "קישור",
      },
      jobRewardsTable: [],
      paintInRed: false,
      dataToExport: [],
      deleteTable: [],
    };
  },
  methods: {
    downloadDemoFile() {
      var emptyForDemo = [];
      this.downloadFile(
        emptyForDemo,
        this.excelHeaders,
        "מבנה גמולי תפקיד.xlsx",
        "מבנה גמולי תפקיד"
      );
    },
    downloadFile(dataToExport, headers, excelName, sheetName) {
      var temp = dataToExport;
      temp.unshift(headers);
      var EmployeesWs = XLSX.utils.json_to_sheet(temp, {
        skipHeader: true,
        Views: [{ RTL: true }],
      });

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel'
      XLSX.utils.book_append_sheet(wb, EmployeesWs, sheetName);
      this.set_right_to_left(wb);

      // export Excel file
      XLSX.writeFile(wb, excelName);
    },
    set_right_to_left(wb /*:Workbook*/) {
      if (!wb.Workbook) wb.Workbook = {};
      if (!wb.Workbook.Views) wb.Workbook.Views = [];
      if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
      wb.Workbook.Views[0].RTL = true;
    },
    loadFile(e) {
      var files = e.target.files,
        f = files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];

        /* DO SOMETHING WITH workbook HERE */
        workbook.Sheets[sheetName].A1.h = "employmentCode";
        workbook.Sheets[sheetName].A1.v = "employmentCode";
        workbook.Sheets[sheetName].A1.w = "employmentCode";
        workbook.Sheets[sheetName].B1.h = "description";
        workbook.Sheets[sheetName].B1.v = "description";
        workbook.Sheets[sheetName].B1.w = "description";
        workbook.Sheets[sheetName].C1.h = "minHours";
        workbook.Sheets[sheetName].C1.v = "minHours";
        workbook.Sheets[sheetName].C1.w = "minHours";
        workbook.Sheets[sheetName].D1.h = "maxHours";
        workbook.Sheets[sheetName].D1.v = "maxHours";
        workbook.Sheets[sheetName].D1.w = "maxHours";
        workbook.Sheets[sheetName].E1.h = "percent1";
        workbook.Sheets[sheetName].E1.v = "percent1";
        workbook.Sheets[sheetName].E1.w = "percent1";
        workbook.Sheets[sheetName].F1.h = "percent2";
        workbook.Sheets[sheetName].F1.v = "percent2";
        workbook.Sheets[sheetName].F1.w = "percent2";
        workbook.Sheets[sheetName].G1.h = "percent3";
        workbook.Sheets[sheetName].G1.v = "percent3";
        workbook.Sheets[sheetName].G1.w = "percent3";
        workbook.Sheets[sheetName].H1.h = "percent4";
        workbook.Sheets[sheetName].H1.v = "percent4";
        workbook.Sheets[sheetName].H1.w = "percent4";
        workbook.Sheets[sheetName].I1.h = "percent5";
        workbook.Sheets[sheetName].I1.v = "percent5";
        workbook.Sheets[sheetName].I1.w = "percent5";
        workbook.Sheets[sheetName].J1.h = "minPercent";
        workbook.Sheets[sheetName].J1.v = "minPercent";
        workbook.Sheets[sheetName].J1.w = "minPercent";
        workbook.Sheets[sheetName].K1.h = "maxPercent";
        workbook.Sheets[sheetName].K1.v = "maxPercent";
        workbook.Sheets[sheetName].K1.h = "maxPercent";
        workbook.Sheets[sheetName].L1.v = "descLink";
        workbook.Sheets[sheetName].L1.w = "descLink";
        workbook.Sheets[sheetName].L1.h = "descLink";

        let worksheet = workbook.Sheets[sheetName];
        this.jobRewardsTable = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
    },
    ExcelDateToJSDate(date) {
      return new Date(Math.round((date - 25569) * 86400 * 1000));
    },
    async saveAll() {
      await axios({
        url: "/jobRewards/saveAll",
        method: "post",
        data: this.jobRewardsTable,
      })
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });

      this.jobRewardsTable = this.deleteTable;
      this.deleteTable = [];
      if (this.jobRewardsTable.length > 0) {
        this.paintInRed = true;
        alert("הרשומות שנשארו לא הצליחו להישמר");
      }
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return 0.0;
      }
      return parseFloat(number).toFixed(2);
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
  margin-top: 5%;
  margin-right: 5%;
}
#btn {
  margin-right: 20px;
}
</style>
