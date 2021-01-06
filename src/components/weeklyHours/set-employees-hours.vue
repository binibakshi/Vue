<template>
  <v-card>
    <div class="littleMargin">
      <v-row id="mossadHoursDetails">
        <v-col cols="12" md="2">
          <v-select
            style="max-hight: 40px"
            :items="years"
            @change="onYearChanged()"
            v-model="selectedYear"
            item-text="hebrewYear"
            item-value="year"
            label="שנה"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <p>מוסד - {{ _mossadInfo.mossadName }}</p>
        </v-col>
        <v-col cols="12" md="2" @click="test()">
          <p>שעות מאוישות - {{ _mossadInfo.currHours }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>יתרת שעות - {{ _mossadInfo.maxHours - _mossadInfo.currHours }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>מגבלת שעות- {{ _mossadInfo.maxHours }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>
            אחוז איוש -
            {{
              getTwoDigits(
                (_mossadInfo.currHours / _mossadInfo.maxHours) * 100
              )
            }}%
          </p>
        </v-col>
      </v-row>
      <div v-show="_mossadInfo.maxHours != null && _mossadInfo.maxHours != 0">
        <v-row id="employeeDetails">
          <v-col id="serchEmployee" cols="12" md="3">
            <v-autocomplete
              :disabled="
                _mossadInfo.maxHours == null || _mossadInfo.maxHours == 0
              "
              v-model="empId"
              :items="tzArray"
              color="indigo lighten-5"
              hide-selected
              :item-text="
                (item) =>
                  item.firstName + ' ' + item.lastName + ' - ' + item.empId
              "
              item-value="empId"
              label="תעודת זהות"
              placeholder="חפש"
              @change="getEmployeeInfo()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" md="1">
            <p>שם פרטי</p>
            {{ employeeInfo.firstName }}
          </v-col>
          <v-col cols="12" md="1">
            <p>שם משפחה</p>
            {{ employeeInfo.lastName }}
          </v-col>
          <v-col cols="12" md="1">
            <p>גיל</p>
            {{ _getAge }}
          </v-col>
          <v-col cols="12" md="1">
            <p>משרת אם</p>
            {{ formatIsMother }}
          </v-col>
          <v-col cols="12" md="1">
            <p>שעות גיל</p>
            {{ _getAgeHours }}
          </v-col>
          <v-col cols="12" md="4">
            <table id="detailsTable">
              <thead>
                <th></th>
                <th>א</th>
                <th>ב</th>
                <th>ג</th>
                <th>ד</th>
                <th>ה</th>
                <th>ו</th>
                <th>סך שעות</th>
                <th>אחוז משרה</th>
              </thead>
              <tbody>
                <tr v-for="(row, index) in empHoursTable" :key="index">
                  <td>{{ getRowType(row.type) }}</td>
                  <td v-for="index in 6" :key="index">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          v-on="on"
                          @mouseover="changeText(row.type, index - 1)"
                        >
                          {{ row.week[index - 1].hours }}</span
                        >
                      </template>
                      <span>{{ hoverText }}</span>
                    </v-tooltip>
                  </td>
                  <td>{{ row.sum }}</td>
                  <td>{{ getTwoDigits(row.jobPercent) }}%</td>
                </tr>
              </tbody>
            </table>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  large
                  class="mr-3 excelMDI"
                  @click="exportEmployeeWeeklyHours()"
                  v-bind="attrs"
                  v-on="on"
                  >mdi-file-excel-outline</v-icon
                >
              </template>
              <span>ייצוא איוש שעות לאקסל</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row v-if="empId != null">
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedReforms"
              :items="relevantRreformTypes"
              item-text="name"
              item-value="reformId"
              label="בחר רפורמה"
              multiple
              single-line
            ></v-select>
          </v-col>
        </v-row>
        <v-card v-if="employeeInfo != null && selectedReforms != null">
          <v-card v-for="(reform, index) in selectedReforms" :key="index">
            <weeklyHours
              :empId="empId"
              :reformType="reform"
              :isMother="employeeInfo.mother"
              :ageHours="ageHours"
              :selectedYear="selectedYear"
              :codeDescription="getRelevantCodesDescription(reform)"
              :existData="getRelevantData(reform)"
            ></weeklyHours>
          </v-card>
        </v-card>
      </div>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
import weeklyHours from "./weekly-hours.vue";
import excelMixin from "../../mixins/excelMixin";
import calcHoursMixin from "../../mixins/calcHoursMixin";
import { bus } from "../../main";

export default {
  name: "setEmployeesHours",
  components: {
    weeklyHours,
  },
  data() {
    return {
      selectedReforms: null,
      selectedYear: 0,
      empId: null,
      ageHours: 0,
      tzArray: [],
      datesRange: { min: "", max: "" },
      employeeInfo: {},
      existData: [],
      reformTypes: [],
      relevantRreformTypes: [],
      codeDescription: [],
      empHoursTable: [],
      mossadot: [],
      mossadInfo: { mossadId: "", mossadName: "", maxHours: 0, currHours: 0 },
      hoverText: "",
    };
  },
  created() {
    this.initilize();
    this.getAllTz();
    this.getCodeDescription();
    this.getMossadot();
    this.getReformTypes();
    this.setBegdaEndda();
    this.getMossadHours();
  },
  mounted() {
    bus.$on("changeWeeklyHours", async () => {
      this.getAllEmpData();
      await this.getMossadHours();
    });
  },
  computed: {
    _getAge() {
      if (this.isNotEmpty(this.employeeInfo)) {
        return;
      }
      var currDate = new Date();
      var birthDate = new Date(this.employeeInfo.birthDate);
      var tempMonth = 0;
      var tempYears = currDate.getFullYear() - birthDate.getFullYear();
      if (currDate.getUTCMonth() < birthDate.getUTCMonth()) {
        tempYears -= 1;
      }
      tempMonth = currDate.getUTCMonth() - birthDate.getUTCMonth();
      if (tempMonth < 0) {
        tempMonth = tempMonth * -1;
      }
      if (tempMonth < 10) {
        tempMonth = "0" + tempMonth;
      }
      return tempYears + "." + tempMonth;
    },
    formatGender() {
      if (this.isNotEmpty(this.employeeInfo)) {
        return;
      }

      if (this.employeeInfo.gender != undefined) {
        if (this.employeeInfo.gender === "M") {
          return "זכר";
        } else {
          return "נקבה";
        }
      }
      return undefined;
    },
    formatIsMother() {
      if (this.isNotEmpty(this.employeeInfo)) {
        return;
      }

      if (this.employeeInfo.mother === true) {
        return "כן";
      } else {
        return "לא";
      }
    },
    _getAgeHours() {
      if (this.isNotEmpty(this.employeeInfo)) {
        return;
      }
      var birthDate = new Date(this.employeeInfo.birthDate);
      var today = new Date();
      var currSchoolYear = new Date(today.getFullYear(), 8, 1);

      if (today.getMonth() >= 8) {
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
    _mossadInfo() {
      return this.mossadInfo;
    },
  },
  methods: {
    test() {
      let routeData = this.$router.resolve({ name: "reportWeeklyHours" });
      window.open(routeData.href, "_blank");
    },
    initilize() {
      let currDate = new Date();
      this.selectedYear =
        currDate.getMonth() >= 8
          ? currDate.getFullYear() + 1
          : currDate.getFullYear();
      this.mossadInfo.mossadId = this.$store.state.mossadId;
      this.mossadInfo.mossadName = this.$store.state.mossadInfo.mossadName;
      this.years = [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ];
      this.empHoursTable = [
        { week: [], sum: 0, jobPercent: 0, type: 0 },
        { week: [], sum: 0, jobPercent: 0, type: 1 },
      ];
      for (let index = 0; index < 6; index++) {
        this.empHoursTable[0].week.push({
          day: index,
          hours: 0,
          mossadot: [],
        });
        this.empHoursTable[1].week.push({ day: index, hours: 0, mossadot: [] });
      }
    },
    onYearChanged() {
      this.initilize();
      this.setBegdaEndda();
      this.getMossadHours();
      this.getAllEmpData();
    },
    getAllTz() {
      axios
        .get("/employees/all")
        .then((response) => {
          this.tzArray = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    async getEmployeeInfo() {
      await axios
        .get("/employees/byId", {
          params: {
            empId: this.empId,
          },
        })
        .then((response) => {
          this.employeeInfo = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
      this.calcAgeHours();
      this.getAllEmpData();
    },
    getMossadHours() {
      axios
        .get("mossadHours/byId", {
          params: {
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
          },
        })
        .then((response) => {
          this.mossadInfo.currHours = response.data.currHours;
          this.mossadInfo.maxHours = response.data.maxHours;
        })
        .catch(() => {
          this.mossadInfo.currHours = 0;
          this.mossadInfo.maxHours = 0;
          alert(
            "לא נמצאו נתונים עבור מוסד בשנה זו בחר שנה אחרת או הוסף שעות למוסד"
          );
        });
    },
    getReformTypes() {
      axios
        .get("/reformTypes/relevant")
        .then((response) => {
          this.reformTypes = response.data;
          this.filterReformTypeByMossad();
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
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getAllEmpData() {
      if (this.empId == null || this.empId == "") {
        return;
      }
      axios
        .get("/teacherEmploymentDetails/byId", {
          params: {
            empId: this.empId,
            begda: this.datesRange.min,
            endda: this.datesRange.max,
          },
        })
        .then((response) => {
          this.existData = response.data;
          this.calcEmpHoursData();
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    setBegdaEndda() {
      this.datesRange.min = this.formatDate(
        new Date(this.selectedYear - 1, 8, 1)
      );
      this.datesRange.max = this.formatDate(new Date(this.selectedYear, 5, 21));
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
    exportEmployeeWeeklyHours() {
      // call function in the mixin
      this.createWeeklyHoursToEmployee(
        this.empId,
        this.$store.state.logginAs,
        this.datesRange.min,
        this.datesRange.max
      );
    },
    filterReformTypeByMossad() {
      if (this.$store.state.mossadInfo.mossadType == 2) {
        this.relevantRreformTypes = this.reformTypes.filter(
          (el) =>
            el.reformId == 1 ||
            el.reformId == 5 ||
            el.reformId == 7 ||
            el.reformId == 2 ||
            el.reformId == 8
        );
      } else if (this.$store.state.mossadInfo.mossadType == 1) {
        this.relevantRreformTypes = this.reformTypes.filter(
          (el) => el.reformId == 1 || el.reformId == 5 || el.reformId == 8
        );
      }
    },

    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    changeText(rowType, index) {
      this.hoverText = this.getMossadotDescription(
        this.empHoursTable[rowType].week[index].mossadot
      );
    },
    getMossadotDescription(mossadotTable) {
      if (mossadotTable == null) {
        return "";
      }
      var mossadotames = "";
      mossadotTable.forEach((el) => {
        mossadotames +=
          this.mossadot.find((e) => e.mossadId == el).mossadName + ", ";
      });
      return mossadotames;
    },
    getRelevantCodesDescription(reformType) {
      return this.codeDescription.filter((el) => el.reformType == reformType);
    },
    getRelevantData(reformType) {
      return this.existData.filter(
        (el) =>
          el.reformType == reformType &&
          el.mossadId == this.$store.state.logginAs
      );
    },
    getMossadot() {
      axios
        .get("mossadot/all")
        .then((response) => (this.mossadot = response.data))
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    calcAgeHours() {
      if (this.employeeInfo.birthDate === undefined) {
        this.ageHours = 0;
      }
      var birthDate = new Date(this.employeeInfo.birthDate);
      var today = new Date();
      var currSchoolYear = new Date(today.getFullYear(), 8, 1);

      if (today.getMonth() >= 8) {
        currSchoolYear.setFullYear(currSchoolYear.getFullYear() + 1);
      }
      var age = currSchoolYear.getFullYear() - birthDate.getFullYear();
      if (age < 50) {
        this.ageHours = 0;
      } else if (age > 55) {
        this.ageHours = 4;
      } else {
        this.ageHours = 2;
      }
    },
    totalHours(week) {
      if (week != null) {
        let sum = 0;
        for (let index = 0; index < 6; index++) {
          sum = sum + parseFloat(week[index]);
        }
        return sum;
      } else {
        return 0;
      }
    },
    getRowType(type) {
      if (type === 0) {
        return "במוסד";
      }
      return "בכל המוסדות";
    },
    calcEmpHoursData() {
      // this function calc all emp hours the

      // set initial values in the displayed array
      this.empHoursTable = [
        { week: [], sum: 0, jobPercent: 0, type: 0 },
        { week: [], sum: 0, jobPercent: 0, type: 1 },
      ];
      for (let index = 0; index < 6; index++) {
        this.empHoursTable[0].week.push({
          day: index,
          hours: 0,
          mossadot: [this.$store.state.logginAs],
        });
        this.empHoursTable[1].week.push({ day: index, hours: 0, mossadot: [] });
      }

      // get acutal hours devied by curr mossad(0) and all mossadot(1)
      this.existData.forEach((el) => {
        if (el.mossadId == this.$store.state.logginAs) {
          this.empHoursTable[0].week[el.day].hours += el.hours;
          this.empHoursTable[0].sum += el.hours;
        }
        this.empHoursTable[1].week[el.day].hours += el.hours;
        this.empHoursTable[1].sum += el.hours;
        if (
          !this.empHoursTable[1].week[el.day].mossadot.includes(el.mossadId)
        ) {
          this.empHoursTable[1].week[el.day].mossadot.push(el.mossadId);
        }
      });

      // calc job percent devied by curr mossad and all mossadot
      this.reformTypes.forEach((el) => {
        let currReformPerMossadSum = this.existData
          .filter(
            (e) =>
              e.reformType == el.reformId &&
              e.mossadId == this.$store.state.logginAs
          )
          .reduce((sum, e) => (sum += parseFloat(e.hours)), 0);
        this.empHoursTable[0].jobPercent += this.calcJobPercent(
          el.reformId,
          currReformPerMossadSum,
          this.ageHours,
          this.employeeInfo.mother
        );
        let currReformSum = this.existData
          .filter((e) => e.reformType == el.reformId)
          .reduce((sum, e) => (sum += parseFloat(e.hours)), 0);
        this.empHoursTable[1].jobPercent += this.calcJobPercent(
          el.reformId,
          currReformSum,
          this.ageHours,
          this.employeeInfo.mother
        );
      });
    },
    isNotEmpty(obj) {
      for (var i in obj) return false;
      return true;
    },
  },
  mixins: [excelMixin, calcHoursMixin],
};
</script>

<style scoped>
p {
  font-weight: bold;
}
.littleMargin {
  margin-right: 3%;
  margin-left: 3%;
}
#serchEmployee {
  max-width: 400px;
}
table,
tr,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
tbody {
  display: table-row-group;
  vertical-align: inherit;
  border-block: inherit;
}
thead {
  display: table-header-group;
  vertical-align: inherit;
  border-color: inherit;
}
th {
  font-weight: bold;
}
td,
th {
  margin: 1px;
  padding: 1px;
  min-width: 25px;
  max-width: 100px;
  text-align: center;
}
#detailsTable {
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-right: auto;
  margin-bottom: 20px;
}
#mossadHoursDetails {
  border-bottom: 1px solid;
}
.excelMDI {
  color: green;
  position: absolute;
  left: 3%;
  background-color: lightgray;
}
.v-icon:hover {
  color: blue;
  display: "tete";
}
</style>