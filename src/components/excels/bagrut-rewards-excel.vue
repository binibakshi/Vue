<template>
  <v-card class="wrapper">
    <v-card>
      <v-card-title>אקסלים לקליטה</v-card-title>
      <v-row class="giveSomeSpace">
        <input type="file" id="file" ref="file" @change="loadFile" />
        <v-btn
          v-if="bagrutRewardsTable != null"
          id="btn"
          color="primary"
          dark
          dense
          @click="saveAll()"
          >שמור הכל</v-btn
        >
        <v-btn color="primary" dark dense @click="downloadDemoFile()">מבנה אקסל</v-btn>

        <div v-if="bagrutRewardsTable.length > 0">
          <v-data-table
            dense
            id="myTable"
            :headers="headers"
            :items="bagrutRewardsTable"
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
        { text: "קוד מקצוע", value: "studyId" },
        { text: "מקצוע", value: "studyName" },
        { text: 'יח"ל', value: "studyUnits" },
        { text: "שאלון", value: "questionnaire" },
        { text: "שעות פנימי", value: "internalHoursReward" },
        { text: "אחוזים פנימי", value: "internalPercentReward" },
        { text: "שעות חיצוני", value: "externalHoursReward" },
        { text: "אחוזים חיצוני", value: "externalPercentReward" },
      ],
      excelHeaders: {
        studyId: "קוד מקצוע",
        studyName: "מקצוע",
        studyUnits: 'יח"ל',
        questionnaire: "שאלון",
        internalHoursReward: "שעות פנימי",
        internalPercentReward: "אחוזים פנימי",
        externalHoursReward: "שעות חיצוני",
        externalPercentReward: "אחוזים חיצוני",
      },
      bagrutRewardsTable: [],
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
        "מבנה גמולי בגרות.xlsx",
        "מבנה גמולי בגרות"
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
        workbook.Sheets[sheetName].A1.h = "studyId";
        workbook.Sheets[sheetName].A1.v = "studyId";
        workbook.Sheets[sheetName].A1.w = "studyId";
        workbook.Sheets[sheetName].B1.h = "studyName";
        workbook.Sheets[sheetName].B1.v = "studyName";
        workbook.Sheets[sheetName].B1.w = "studyName";
        workbook.Sheets[sheetName].C1.h = "questionnaire";
        workbook.Sheets[sheetName].C1.v = "questionnaire";
        workbook.Sheets[sheetName].C1.w = "questionnaire";
        workbook.Sheets[sheetName].D1.h = "studyUnits";
        workbook.Sheets[sheetName].D1.v = "studyUnits";
        workbook.Sheets[sheetName].D1.w = "studyUnits";
        workbook.Sheets[sheetName].E1.h = "internalHoursReward";
        workbook.Sheets[sheetName].E1.v = "internalHoursReward";
        workbook.Sheets[sheetName].E1.w = "internalHoursReward";
        workbook.Sheets[sheetName].F1.h = "internalPercentReward";
        workbook.Sheets[sheetName].F1.v = "internalPercentReward";
        workbook.Sheets[sheetName].F1.w = "internalPercentReward";
        workbook.Sheets[sheetName].G1.h = "externalHoursReward";
        workbook.Sheets[sheetName].G1.v = "externalHoursReward";
        workbook.Sheets[sheetName].G1.w = "externalHoursReward";
        workbook.Sheets[sheetName].H1.h = "externalPercentReward";
        workbook.Sheets[sheetName].H1.v = "externalPercentReward";
        workbook.Sheets[sheetName].H1.w = "externalPercentReward";

        let worksheet = workbook.Sheets[sheetName];
        this.bagrutRewardsTable = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
    },
    ExcelDateToJSDate(date) {
      return new Date(Math.round((date - 25569) * 86400 * 1000));
    },
    async saveAll() {
      await axios({
        url: "/bagrutRewards/saveAll",
        method: "post",
        data: this.bagrutRewardsTable,
      })
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });

      this.bagrutRewardsTable = this.deleteTable;
      this.deleteTable = [];
      if (this.bagrutRewardsTable.length > 0) {
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
