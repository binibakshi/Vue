<template>
  <div class="wrapper">
    <v-row id="selections" style="align-items: initial">
      <v-col cols="12" md="2">
        <v-select
          :items="$store.state.years"
          v-model="selectedYear"
          item-text="hebrewYear"
          item-value="year"
          label="שנה"
          placeholder="בחר שנה"
          @change="onYearChange()"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" v-if="this.$store.state.mossadId == 999">
        <v-autocomplete
          v-model="selectedMossadId"
          :items="mossadot"
          item-text="mossadName"
          item-value="mossadId"
          label="מוסד"
          placeholder="בחר מוסד"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="1">
        <v-btn color="primary" @click="getGaps()">חפש</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-btn color="success" @click="downloadDemoFile()"
        >מבנה קובץ לקליטת פרטי שעות שבועיות</v-btn
      >
    </v-row>
    <v-row>
      <input type="file" id="file" ref="file" @change="filesChange" />
      <v-btn
        v-if="teacherHoursTable != null"
        color="primary"
        dark
        @click="saveAll()"
        >שמור הכל</v-btn
      >
    </v-row>
    <div v-if="teacherHoursTable != null">
      <v-data-table
        dense
        id="myTable"
        :headers="headers"
        :items="teacherHoursTable"
        :items-per-page="50"
        class="elevation-1"
      >
        <template v-slot:[`item.begda`]="{ item }">{{
          FormatDate(item.begda)
        }}</template>
        <template v-slot:[`item.endda`]="{ item }">{{
          FormatDate(item.endda)
        }}</template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";

export default {
  name: "teacherHoursExcel",
  data() {
    return {
      file: null,
      headers: [
        { text: "תעודת זהות", value: "empId" },
        { text: "קוד מקצוע", value: "empCode" },
        { text: "מתאריך", value: "begda" },
        { text: "עד תאריך", value: "endda" },
        { text: "שעות", value: "hours" },
      ],
      teacherHoursTable: null,
      selectedYear: 0,
      selectedMossadId: 0,
      mossadot: [],
      paintInRed: false,
      dataToExport: [],
      unSavedRows: [],
      codeDescription: [],
    };
  },
  async mounted() {
    this.initilize();
    this.getMossadot();
    await this.getCodeDescription();
  },
  methods: {
    initilize() {
      if (this.$store.state.selectedYear != 0) {
        this.selectedYear = this.$store.state.selectedYear;
      } else {
        let currDate = new Date();
        this.selectedYear =
          currDate.getMonth() >= 8
            ? currDate.getFullYear() + 1
            : currDate.getFullYear();
      }
      if (this.$store.state.logginAs == this.$store.state.logginAs) {
        this.selectedMossadId = this.$store.state.logginAs;
      }
    },
    async getCodeDescription() {
      await axios
        .get("/convertHours/all")
        .then((response) => {
          this.codeDescription = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    async saveAll() {
      let hoursToSave = [];
      this.teacherHoursTable.forEach((el) => {
        let currCodeDescription = this.codeDescription.find(
          (e) => e.code == el.empCode
        );
        if (currCodeDescription == undefined) {
          this.unSavedRows.push(el);
          return;
        }
        hoursToSave.push({
          empId: el.empId,
          mossadId: this.selectedMossadId,
          empCode: el.empCode,
          reformType: currCodeDescription.reformType,
          begda: el.begda,
          endda: el.endda,
          hours: el.hours,
          changedBy: this.$store.state.username,
        });
      });

      axios({
        url: "/teacherHours/cleanSave",
        method: "post",
        data: hoursToSave,
      })
        .then((response) => {
          let tempData = response.data;
          hoursToSave.forEach((el) => {
            if (tempData.find((e) => e.empCode == el.empCode) == undefined) {
              this.unSavedRows.push(el);
            }
          });
          if (tempData.length > 0) {
            alert("הנתונים נשמרו בהצלחה");
          }
          if (this.unSavedRows.length > 0) {
            this.paintInRed = true;
            this.teacherHoursTable = this.unSavedRows;
            alert("הרשומות שנשארו לא הצליחו להישמר");
          }
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    getMossadot() {
      axios
        .get("mossadot/all")
        .then((response) => {
          this.mossadot = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    onYearChange() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
    },
    downloadDemoFile() {
      var emptyForDemo = [];
      this.downloadFile(
        emptyForDemo,
        this.getTeacherHoursHeaders(),
        "שעות שבועיות.xlsx",
        "מבנה שעות שבועיות"
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
    getTeacherHoursHeaders() {
      var headers = {
        empId: "תעודת זהות",
        empCode: "קוד מקצוע",
        begda: "מתאריך",
        endda: "עד תאריך",
        hours: "שעות",
      };
      return headers;
    },
    filesChange(e) {
      this.dataToExport = [];
      this.unSavedRows = [];
      this.teacherHoursTable = [];
      var files = e.target.files,
        f = files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];

        /* DO SOMETHING WITH workbook HERE */
        workbook.Sheets[sheetName].A1.h = "empId";
        workbook.Sheets[sheetName].A1.v = "empId";
        workbook.Sheets[sheetName].A1.w = "empId";
        workbook.Sheets[sheetName].B1.h = "empCode";
        workbook.Sheets[sheetName].B1.v = "empCode";
        workbook.Sheets[sheetName].B1.w = "empCode";
        workbook.Sheets[sheetName].C1.h = "begda";
        workbook.Sheets[sheetName].C1.v = "begda";
        workbook.Sheets[sheetName].C1.w = "begda";
        workbook.Sheets[sheetName].D1.h = "endda";
        workbook.Sheets[sheetName].D1.v = "endda";
        workbook.Sheets[sheetName].D1.w = "endda";
        workbook.Sheets[sheetName].E1.h = "hours";
        workbook.Sheets[sheetName].E1.v = "hours";
        workbook.Sheets[sheetName].E1.w = "hours";

        let worksheet = workbook.Sheets[sheetName];
        this.teacherHoursTable = XLSX.utils.sheet_to_json(worksheet);

        this.teacherHoursTable.forEach((element) => {
          element.mossadId = this.selectedMossadId;
          element.begda = this.ExcelDateToJSDate(element.begda);
          element.endda = this.ExcelDateToJSDate(element.endda);
        });
      };
      reader.readAsArrayBuffer(f);
    },
    ExcelDateToJSDate(date) {
      return new Date(Math.round((date - 25569) * 86400 * 1000));
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
      formattedDate = day + "/" + month + "/" + year;
      return formattedDate;
    },
  },
};
</script>

<style scoped>
input {
  border: 1px solid;
}
.v-btn {
  margin: 10px;
}
#myTable {
  max-width: 70%;
  margin-top: 5%;
  margin-right: 10%;
}
</style>
