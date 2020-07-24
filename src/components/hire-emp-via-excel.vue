<template>
  <v-card>
    <v-card-title>קליטת עובדים Excel</v-card-title>
    <v-row class="giveSomeSpace">
      <v-btn class="btn" color="info" @click="downloadDemoFile()">הורד מבנה קובץ Excel</v-btn>

      <v-btn class="btn" color="info" @click="getAllEmployees()">ייצוא עובדים לExcel</v-btn>
    </v-row>

    <v-row class="giveSomeSpace">
      <input type="file" id="file" ref="file" @change="filesChange" />
      <v-btn v-if="employeesTable != null" id="btn" color="primary" dark @click="saveAll()">שמור הכל</v-btn>
    </v-row>

    <div v-if="employeesTable != null">
      <v-data-table
        dense
        id="myTable"
        :headers="headers"
        :items="employeesTable"
        :items-per-page="50"
        class="elevation-1"
      ></v-data-table>
    </div>
  </v-card>
</template>

<script>
/* eslint-disable no-debugger */
// import axios from "axios";
import XLSX from "xlsx";
import axios from "axios";

export default {
  name: "HireEmpsvieExcel",
  data() {
    return {
      file: null,
      headers: [
        { text: "עובד", value: "empId" },
        { text: "שם פרטי", value: "firstName" },
        { text: "שם משפחה", value: "lastName" },
        { text: "תאריך לידה", value: "birthDate" },
        { text: "מורה אם", value: "mother" },
        { text: "שעות גיל", value: "ageHours" },
      ],
      employeesTable: null,
      paintInRed: false,
      dataToExport: [],
      deleteTable: [],
    };
  },
  methods: {
    async getAllEmployees() {
      let allEmployees = await axios
        .get("/employees/all")
        .then((response) => {
          // allEmployees = response.data;
          return response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );

      allEmployees.forEach((el) => {
        this.dataToExport.push({
          empId: el.empId,
          firstName: el.firstName,
          lastName: el.lastName,
          birthDate: this.formattedDate(el.birthDate),
          gender: this.fromatGenderText(el.gender),
          mother: this.formatMotherType(el.mother),
          ageHours: this.getageHours(el.birthDate),
        });
      });
      this.downloadFile(this.dataToExport);
    },
    downloadDemoFile() {
      var emptyForDemo = [];
      this.downloadFile(emptyForDemo);
    },
    downloadFile(dataToExport) {
      var temp = dataToExport;
      temp.unshift({
        empId: "עובד",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        birthDate: "תאריך לידה",
        gender: "מין",
        mother: "משרת אם",
        ageHours: "שעות גיל",
      });
      var EmployeesWs = XLSX.utils.json_to_sheet(temp, {
        skipHeader: true,
        Views: [{ RTL: true }],
      });

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel'
      XLSX.utils.book_append_sheet(wb, EmployeesWs, "מבנה קליטת עובדים");
      this.set_right_to_left(wb);

      // export Excel file
      XLSX.writeFile(wb, "עובדים.xlsx");
    },
    set_right_to_left(wb /*:Workbook*/) {
      if (!wb.Workbook) wb.Workbook = {};
      if (!wb.Workbook.Views) wb.Workbook.Views = [];
      if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
      wb.Workbook.Views[0].RTL = true;
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
        workbook.Sheets[sheetName].B1.h = "firstName";
        workbook.Sheets[sheetName].B1.v = "firstName";
        workbook.Sheets[sheetName].B1.w = "firstName";
        workbook.Sheets[sheetName].C1.h = "lastName";
        workbook.Sheets[sheetName].C1.v = "lastName";
        workbook.Sheets[sheetName].C1.w = "lastName";
        workbook.Sheets[sheetName].D1.h = "birthDate";
        workbook.Sheets[sheetName].D1.v = "birthDate";
        workbook.Sheets[sheetName].D1.w = "birthDate";
        workbook.Sheets[sheetName].E1.h = "mother";
        workbook.Sheets[sheetName].E1.v = "mother";
        workbook.Sheets[sheetName].E1.w = "mother";
        workbook.Sheets[sheetName].F1.h = "ageHours";
        workbook.Sheets[sheetName].F1.v = "ageHours";
        workbook.Sheets[sheetName].F1.w = "ageHours";

        let worksheet = workbook.Sheets[sheetName];
        this.employeesTable = XLSX.utils.sheet_to_json(worksheet);

        this.employeesTable.forEach((element) => {
          element.birthDate = this.ExcelDateToJSDate(element.birthDate);
        });
      };
      reader.readAsArrayBuffer(f);
    },
    ExcelDateToJSDate(date) {
      return new Date(Math.round((date - 25569) * 86400 * 1000));
    },
    async saveAll() {
      let promises = [];
      this.employeesTable.forEach((el, index) => {
        promises.push(
          axios
            .post(`/employees/save`, {
              empId: el.empId,
              firstName: el.firstName,
              lastName: el.lastName,
              birthDate: el.birthDate,
              begda: new Date(),
              mother: this.getIsMother(el.mother),
            })
            .then(() => {
              this.employeesTable.slice(index, 1);
            })
            .catch((e) => {
              console.log(e);
              this.deleteTable.push(el);
            })
        );
      });

      await Promise.all(promises).then();
      this.employeesTable = this.deleteTable;
      this.deleteTable = [];
      if (this.employeesTable.length > 0) {
        this.paintInRed = true;
        alert("הרשומות שנשארו לא הצליחו להישמר");
      }
    },
    getIsMother(mother) {
      if (mother == "לא") {
        return 0;
      }
      return 1;
    },
    formattedDate(birthDate) {
      var d = new Date(birthDate);
      return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join("/");
    },
    fromatGenderText(gender) {
      if (gender == "F") {
        return "נקבה";
      }
      return "זכר";
    },
    formatMotherType(mother) {
      if (mother == 1) {
        return "כן";
      }
      return "לא";
    },
    getageHours(getDate) {
      if (getDate === undefined) {
        return null;
      }
      var birthDate = new Date(getDate);
      var currDate = new Date();

      var age = currDate.getFullYear() - birthDate.getFullYear();
      if (age < 50) {
        return 0;
      } else if (age > 55) {
        return 4;
      } else {
        return 2;
      }
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
