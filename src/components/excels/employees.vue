<template>
  <div class="wrapper">
    <div>
      <v-row class="giveSomeSpace">
        <v-btn class="btn" color="success" @click="getAllEmployees()"
          >אקסל פרטי עובדים
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";

export default {
  name: "HireEmpsvieExcel",
  data() {
    return {
      file: null,
      headers: [
        { text: "תעודת זהות", value: "empId" },
        { text: "שם משפחה", value: "lastName" },
        { text: "שם פרטי", value: "firstName" },
        { text: "תאריך לידה", value: "birthDate" },
        { text: "מורה אם", value: "mother" },
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
          ageHours: this.getAgeHours(el.birthDate),
        });
      });
      this.downloadFile(
        this.dataToExport,
        this.getEmployeesHeaders(),
        "עובדים.xlsx",
        "מבנה קליטת עובדים"
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
    getEmployeesHeaders() {
      var headers = {
        empId: "תעודת זהות",
        lastName: "שם משפחה",
        firstName: "שם פרטי",
        birthDate: "תאריך לידה",
        gender: "מין",
        mother: "משרת אם",
      };
      return headers;
    },
    ExcelDateToJSDate(date) {
      return new Date(Math.round((date - 25569) * 86400 * 1000));
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
    getAgeHours(getDate) {
      var birthDate = new Date(getDate);
      var today = new Date();
      var currSchoolYear = new Date(today.getFullYear(), 8, 1);

      if (today.getUTCMonth() >= 8) {
        currSchoolYear.setFullYear(currSchoolYear.getFullYear() + 1);
      }

      var age = currSchoolYear.getFullYear() - birthDate.getFullYear();
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
