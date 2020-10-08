<template>
  <div>
    <v-row id="selections" class="center" style="align-items: initial">
      <v-col cols="12" md="2">
        <v-select
          :items="years"
          v-model="selections.year"
          item-text="hebrewYear"
          item-value="year"
          label="שנה"
          placeholder="בחר שנה"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
          v-model="selections.mossadId"
          multiple
          :items="mossadot"
          item-text="mossadName"
          item-value="mossadId"
          label="מוסד"
          placeholder="בחר מוסד"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="selections.reformType"
          multiple
          :items="reformTypes"
          item-text="name"
          item-value="reformId"
          placeholder="בחר רפורמה"
          label="רפורמה"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="selections.code"
          multiple
          :items="codeDescription"
          :item-text="(item) => item.code + ' - ' + item.codeDescription"
          item-value="code"
          label="קוד פיצול"
          placeholder="בחר קוד פיצול"
        ></v-select>
        <v-btn color="primary" @click="getSelectedData()">חפש</v-btn>
      </v-col>
    </v-row>

    <div id="weeklyHoursReport">
      <v-data-table
        dense
        :headers="headers"
        :items="dataToDisplay"
        :search="search"
        :footer-props="{
          'items-per-page-options': [20, 50, 100, -1],
          'items-per-page-text': 'מספר תוצאות  :',
        }"
        no-data-text=""
        item-key="empId"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              <v-card-title>
                <v-row>
                  <v-col cols="12" md="10">
                    <v-text-field
                      v-model="search"
                      label="Search"
                      placeholder="חפש"
                      single-line
                      autocomplete="off"
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-title>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="exportDataToExcel()"
              >ייצא לקסל</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.empId }}</td>
            <td>{{ item.firstName }}</td>
            <td>{{ item.lastName }}</td>
            <td>{{ item.frontalHours }}</td>
          </tr>
        </template>
        <template slot="body.append">
          <tr>
            <td class="title"></td>
            <td class="title"></td>
            <td class="title">עובדים - {{ dataToDisplay.length }}</td>
            <td class="title">סך שעות - {{ totalHours() }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import excelMixin from "../../mixins/excelMixin";

const FRONTAL = 1;

export default {
  data() {
    return {
      headers: [],
      search: "",
      years: [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ],
      mossadot: [],
      employees: [],
      reformTypes: [],
      codeDescription: [],
      existData: [],
      dataToDisplay: [],
      selections: {
        year: 0,
        mossadId: [],
        reformType: [],
        code: [],
        status: [],
      },
    };
  },
  created() {
    this.initilize();
    this.getCodeDescription();
    this.getMossadot();
    this.getReformTypes();
    this.getEmployees();
    this.getSelectedData();
  },
  methods: {
    initilize() {
      this.headers = [
        { text: "תעודת זהות", value: "empId" },
        { text: "שם פרטי", value: "firstName" },
        { text: "שם משפחה", value: "lastName" },
        { text: "שעות פרונטליות", value: "frontalHours" },
      ];
      var currDate = new Date();
      this.selections.year =
        currDate.getMonth() >= 8
          ? currDate.getFullYear() + 1
          : currDate.getFullYear();
      if (this.$store.state.logginAs != 999) {
        this.selections.mossadId.push(this.$store.state.logginAs);
      }
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
    getEmployees() {
      axios
        .get("/employees/all")
        .then((response) => {
          this.employees = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getReformTypes() {
      axios
        .get("/reformTypes/relevant")
        .then((response) => {
          this.reformTypes = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getCodeDescription() {
      axios
        .get("/convertHours/all")
        .then((response) => {
          this.codeDescription = response.data;
          this.codeDescription = response.data.filter(
            (el) => el.hourType == FRONTAL || el.hourType == 0
          );
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    setDataToDispay() {
      this.dataToDisplay = [];
      // set hours
      this.existData.forEach((el) => {
        let currEmpId = this.dataToDisplay.find((e) => e.empId == el.empId);
        if (currEmpId != null) {
          currEmpId.frontalHours += el.hours;
        } else {
          this.dataToDisplay.push({ empId: el.empId, frontalHours: el.hours });
        }
      });
      // set personal details
      this.dataToDisplay.forEach((el) => {
        let currEmpId = this.employees.find((e) => e.empId == el.empId);
        el.firstName = currEmpId.firstName;
        el.lastName = currEmpId.lastName;
      });
    },
    totalHours() {
      return this.dataToDisplay.reduce(
        (sum, el) => (sum += parseFloat(el.frontalHours)),
        0
      );
    },
    getSelectedData() {
      console.log("try selecting");

      var params = {
        begda: this.formatDate(new Date(this.selections.year - 2, 8, 1)),
        endda: this.formatDate(new Date(this.selections.year + 2, 5, 20)),
        mossadId: this.addSpaceIfNeeded(this.selections.mossadId),
        reformType: this.addSpaceIfNeeded(this.selections.reformType),
        empCode: this.addSpaceIfNeeded(this.selections.code),
        status: this.selections.status,
      };
      console.log(params);
      axios
        .get("teacherEmploymentDetails/getReport", {
          params: params,
        })
        .then((response) => {
          this.existData = response.data.filter((el) =>
            this.codeDescription.some((e) => e.code == el.empCode)
          );
          this.setDataToDispay();
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    formatDate(currrDate) {
      var inputDate = new Date(currrDate);
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
    addSpaceIfNeeded(object) {
      if (object != null) {
        return object + "";
      }
      return object;
    },
    exportDataToExcel() {
      var dataToExport = [];
      var excelHeaders = {
        year: "שנה",
        empId: "תעודת זהות",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        frontalHours: "שעות פרונטליות",
      };
      this.dataToDisplay.forEach((el) => {
        dataToExport.push({
          year: this.selections.year,
          empId: el.empId,
          firstName: el.firstName,
          lastName: el.lastName,
          frontalHours: el.frontalHours,
        });
      });
      this.downloadFile(
        dataToExport,
        excelHeaders,
        "דוח שעות.xlsx",
        "סיכום שעות"
      );
    },
  },
  mixins: [excelMixin],
};
</script>

<style scoped>
#weeklyHoursReport {
  max-width: 60%;
  margin: auto;
}
</style>