<template>
  <div>
    <v-row id="selections" class="center" style="align-items: initial">
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
    <div class="center">
      <v-progress-circular
        :size="100"
        color="primary"
        indeterminate
        v-show="circleProgress"
      ></v-progress-circular>
    </div>
    <div id="weeklyHoursReport">
      <v-data-table
        dense
        v-show="!circleProgress"
        :headers="headers"
        :items="dataToDisplay"
        :search="search"
        @click:row="onRowClicked"
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
                      append-icon="mdi-magnify"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-title>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="success" @click="exportDataToExcel()"
              >ייצא לקסל</v-btn
            >
            <v-btn
              v-if="$store.state.mossadId != 999"
              color="success"
              @click="exportExpandExcel()"
              >ייצא אקסל לשכר</v-btn
            >
          </v-toolbar>
        </template>
        <template slot="body.append">
          <tr>
            <td class="title"></td>
            <td class="title"></td>
            <td class="title">עובדים - {{ dataToDisplay.length }}</td>
            <td class="title">סך שעות - {{ getTwoDigits(totalHours()) }}</td>
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
  name: "reportWeeklyHours",
  data() {
    return {
      headers: [],
      search: "",
      mossadot: [],
      datesRange: { min: "", max: "" },
      employees: [],
      reformTypes: [],
      codeDescription: [],
      existData: [],
      dataToDisplay: [],
      selections: {
        mossadId: [],
        reformType: [],
        code: [],
        status: [],
      },
      adminHours: [],
      selectedYear: 0,
      circleProgress: false,
    };
  },
  async mounted() {
    this.initilize();
    let promises = [];
    promises.push(this.getCodeDescription());
    promises.push(this.getMossadot());
    promises.push(this.getReformTypes());
    promises.push(this.getEmployees());
    await Promise.all(promises).then();
    await this.getSelectedData();
  },
  methods: {
    initilize() {
      this.headers = [
        { text: "תעודת זהות", value: "empId" },
        { text: "שם פרטי", value: "firstName" },
        { text: "שם משפחה", value: "lastName" },
        { text: "שעות פרונטליות", value: "frontalHours" },
      ];

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
        this.selections.mossadId.push(this.$store.state.logginAs);
      }
      this.setBegdaEndda();
      this.circleProgress = true;
    },
    setBegdaEndda() {
      this.datesRange.min = this.formatDate(
        new Date(this.selectedYear - 1, 8, 1)
      );
      this.datesRange.max = this.formatDate(new Date(this.selectedYear, 5, 20));
    },
    async getMossadot() {
      await axios
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
    async getEmployees() {
      await axios
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
    async getReformTypes() {
      await axios
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
    async getCodeDescription() {
      await axios
        .get("/convertHours/all")
        .then((response) => {
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
    exportExpandExcel() {
      this.createWeeklyHoursToMossad(
        this.$store.state.logginAs,
        this.datesRange.min,
        this.datesRange.max
      );
    },
    onRowClicked(row) {
      this.$store.dispatch("setEmpId", row.empId);
      this.$store.dispatch("setLoggedAs", row.mossadId);
      let routeData = this.$router.resolve({ name: "employeeInfo" });
      window.open(routeData.href);
    },
    setDataToDispay() {
      this.dataToDisplay = [];
      // set hours
      this.existData.forEach((el) => {
        let currEmpId = this.dataToDisplay.find((e) => e.empId == el.empId);
        if (currEmpId != null) {
          currEmpId.frontalHours += el.hours;
        } else {
          this.dataToDisplay.push({
            empId: el.empId,
            frontalHours: el.hours,
            mossadId: el.mossadId,
          });
        }
      });
      this.adminHours.forEach((el) => {
        let currEmpId = this.dataToDisplay.find((e) => e.empId == el.empId);
        if (!currEmpId) {
          this.dataToDisplay.push({
            empId: el.empId,
            frontalHours: el.hours,
            mossadId: el.mossadId,
          });
        } else {
          currEmpId.hours += el.hours;
        }
      });

      // set personal details and .toFixed
      this.dataToDisplay.forEach((el) => {
        let currEmpId = this.employees.find((e) => e.empId == el.empId);
        el.firstName = currEmpId.firstName;
        el.lastName = currEmpId.lastName;
        el.frontalHours = el.frontalHours.toFixed(2);
      });
    },
    totalHours() {
      return this.dataToDisplay
        .reduce((sum, el) => (sum += parseFloat(el.frontalHours)), 0)
        .toFixed(2);
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    async getSelectedData() {
      this.circleProgress = true;
      let promises = [];
      var params = {
        begda: this.formatDate(new Date(this.selectedYear - 1, 7, 1)),
        endda: this.formatDate(new Date(this.selectedYear + 0, 6, 20)),
        mossadId: this.addSpaceIfNeeded(this.selections.mossadId),
        reformType: this.addSpaceIfNeeded(this.selections.reformType),
        empCode: this.addSpaceIfNeeded(this.selections.code),
        status: this.selections.status,
      };
      promises.push(
        axios
          .get("teacherEmploymentDetails/getReport", {
            params: params,
          })
          .then((response) => {
            this.existData = response.data.filter((el) =>
              this.codeDescription.some((e) => e.code == el.empCode)
            );
          })
          .catch((error) =>
            this.$store.dispatch("displayErrorMessage", {
              error,
            })
          )
      );
      if (this.selections.code == 0 || this.selections.code.includes(71)) {
        promises.push(
          await axios
            .get("teacherHours/byMossadAndCode", {
              params: {
                mossadId: this.addSpaceIfNeeded(this.selections.mossadId),
                empCode: "71",
                begda: this.formatDate(new Date(this.selectedYear - 1, 7, 1)),
                endda: this.formatDate(new Date(this.selectedYear + 0, 6, 20)),
              },
            })
            .then((response) => {
              this.adminHours = response.data;
            })
            .catch((error) =>
              this.$store.dispatch("displayErrorMessage", {
                error,
              })
            )
        );
      }
      await Promise.all(promises).then();
      this.setDataToDispay();
      setTimeout(() => (this.circleProgress = false), 1000);
    },
    onYearChange() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
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
          year: this.selectedYear,
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