<template>
  <v-card class="wrapper">
    <v-card>
      <v-row class="giveSomeSpace">
        <v-btn class="btn" color="success" @click="downloadDemoFile()"
          >מבנה קובץ לקליטת קביעות משרה</v-btn
        >
      </v-row>
      <v-row class="giveSomeSpace">
        <input type="file" id="file" ref="file" @change="filesChange" />
        <v-btn
          v-if="estimateJobPercentTable != null"
          id="btn"
          color="primary"
          dark
          @click="saveAll()"
          >שמור הכל</v-btn
        >
      </v-row>
      <div v-if="estimateJobPercentTable != null">
        <v-data-table
          dense
          id="myTable"
          :headers="headers"
          :items="estimateJobPercentTable"
          :items-per-page="50"
          class="elevation-1"
        ></v-data-table>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";

export default {
  name: "estimateJobPercent",
  data() {
    return {
      file: null,
      headers: [
        { text: "תעודת זהות", value: "empId" },
        { text: "קוד מוסד", value: "mossadId" },
        { text: "שנה", value: "year" },
        { text: "אחוז קביעות משרה", value: "estimateJobPercent" },
      ],
      estimateJobPercentTable: null,
      paintInRed: false,
      dataToExport: [],
      deleteTable: [],
    };
  },
  methods: {
    saveAll() {
      axios({
        url: "/jobPercent/saveAll",
        method: "post",
        data: this.estimateJobPercentTable,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    downloadDemoFile() {
      var emptyForDemo = [];
      this.downloadFile(
        emptyForDemo,
        this.getEmployeesHeaders(),
        "קביעות משרה.xlsx",
        "מבנה קביעות משרה"
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
    getEstimateJobPercentHeaders() {
      var headers = {
        empId: "תעודת זהות",
        mossadId: "קוד מוסד",
        year: "שנה",
        jobPercent: "אחוז קביעות משרה",
      };
      return headers;
    },
    filesChange(e) {
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
        workbook.Sheets[sheetName].B1.h = "mossadId";
        workbook.Sheets[sheetName].B1.v = "mossadId";
        workbook.Sheets[sheetName].B1.w = "mossadId";
        workbook.Sheets[sheetName].C1.h = "year";
        workbook.Sheets[sheetName].C1.v = "year";
        workbook.Sheets[sheetName].C1.w = "year";
        workbook.Sheets[sheetName].D1.h = "jobPercent";
        workbook.Sheets[sheetName].D1.v = "jobPercent";
        workbook.Sheets[sheetName].D1.w = "jobPercent";

        let worksheet = workbook.Sheets[sheetName];
        this.estimateJobPercentTable = XLSX.utils.sheet_to_json(worksheet);
      };
      reader.readAsArrayBuffer(f);
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
