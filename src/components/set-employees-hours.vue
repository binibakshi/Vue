<template>
  <v-card>
    <div class="littleMargin">
      <v-row id="mossadHoursDetails">
        <v-col cols="12" md="2">
          <v-select
            :items="years"
            @change="loadPage()"
            v-model="selectedYear"
            item-text="hebrewYear"
            item-value="year"
            label="שנה"
          ></v-select>
        </v-col>
        <v-col cols="12" md="2">
          <p>מוסד - {{ mossadInfo.mossadName }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>שעות מאוישות - {{ mossadInfo.currHours }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>יתרת שעות - {{ mossadInfo.maxHours - mossadInfo.currHours }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>מגבלת שעות- {{ mossadInfo.maxHours }}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>
            אחוז איוש -
            {{
              getTwoDigits((mossadInfo.currHours / mossadInfo.maxHours) * 100)
            }}%
          </p>
        </v-col>
      </v-row>
      <div v-show="mossadInfo.maxHours != null && mossadInfo.maxHours != 0">
        <v-row>
          <v-col id="serchEmployee" cols="12" md="3">
            <v-autocomplete
              :disabled="
                mossadInfo.maxHours == null || mossadInfo.maxHours == 0
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
          <v-col
            cols="12"
            md="1"
            v-if="Object.keys(this.employeeInfo).length > 0"
          >
            <p>שם פרטי</p>
            {{ employeeInfo.firstName }}
          </v-col>
          <v-col
            cols="12"
            md="1"
            v-if="Object.keys(this.employeeInfo).length > 0"
          >
            <p>שם משפחה</p>
            {{ employeeInfo.lastName }}
          </v-col>
          <v-col
            cols="12"
            md="1"
            v-if="Object.keys(this.employeeInfo).length > 0"
          >
            <p>גיל</p>
            {{ _getAge }}
          </v-col>
          <v-col
            cols="12"
            md="1"
            v-if="Object.keys(this.employeeInfo).length > 0"
          >
            <p>משרת אם</p>
            {{ formatIsMother }}
          </v-col>
          <v-col
            cols="12"
            md="1"
            v-if="Object.keys(this.employeeInfo).length > 0"
          >
            <p>שעות גיל</p>
            {{ _getAgeHours }}
          </v-col>
          <v-col
            cols="12"
            md="4"
            v-if="Object.keys(this.existHours).length > 0"
          >
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
                <tr v-for="(row, index) in existHours" :key="index">
                  <td>{{ getRowType(row.type) }}</td>
                  <td v-for="index in 6" :key="index">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          v-on="on"
                          @mouseover="changeText(index)"
                        >
                          {{ row.week[index - 1] }}</span
                        >
                      </template>
                      <span>{{ hoverText }}</span>
                    </v-tooltip>
                  </td>
                  <td>{{ totalHours(row.week) }}</td>
                  <td>{{ getTwoDigits(row.week[6]) }}%</td>
                </tr>
              </tbody>
            </table>
            <v-icon
              large
              class="mr-3 excelMDI"
              @click="exportEmployeeWeeklyHours()"
              >mdi-file-excel-outline</v-icon
            >
          </v-col>
        </v-row>
        <v-row v-if="empId != null">
          <v-col cols="12" md="3">
            <v-select
              v-model="selectedReforms"
              :items="reformTypes"
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
              :ageHours="_getAgeHours"
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
import excelMixin from "../mixins/excelMixin";
import { bus } from "../main";

export default {
  name: "setEmployeesHours",
  components: {
    weeklyHours,
  },
  data() {
    return {
      search: null,
      selectedReforms: null,
      selectedYear: 2021,
      empId: null,
      tzArray: [],
      datesRange: { min: "", max: "" },
      employeeInfo: {},
      existHours: [],
      weeklyHoursComponents: [],
      reformTypes: [],
      mossadInfo: {},
      hoverText: "",
      test: {},
    };
  },
  created() {
    this.initilize();
    this.getAllTz();
    this.getReformTypes();
    this.setBegdaEndda();
    this.getMossadHours();
  },
  mounted() {
    bus.$on("changeWeeklyHours", () => {
      this.getWeeklySum();
      this.getMossadHours();
    });
  },
  computed: {
    _getAge() {
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
      if (this.employeeInfo.mother === true) {
        return "כן";
      } else {
        return "לא";
      }
    },
    _getAgeHours() {
      if (this.employeeInfo.birthDate === undefined) {
        return null;
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
  },
  methods: {
    initilize() {
      this.mossadInfo.mossadId = this.$store.state.mossadId;
      this.mossadInfo.mossadName = this.$store.state.mossadInfo.mossadName;
      this.years = [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ];
    },
    loadPage() {
      this.initilize();
      this.getAllTz();
      this.getReformTypes();
      this.setBegdaEndda();
      this.getMossadHours();
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
      if (type === 1) {
        return "במוסד";
      }
      return "בכל המוסדות";
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
    getEmployeeInfo() {
      axios
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

      this.getWeeklySum();
    },
    getMossadHours() {
      this.mossadInfo.currHours = 0;
      this.mossadInfo.maxHours = 0;
      axios
        .get("mossadHours/byId", {
          params: {
            mossadId: this.$store.state.logginAuth,
            year: this.selectedYear,
          },
        })
        .then((response) => {
          this.mossadInfo.currHours = response.data.currHours;
          this.mossadInfo.maxHours = response.data.maxHours;
        })
        .catch(() => {
          alert(
            "לא נמצאו נתונים עבור מוסד בשנה זו בחר שנה אחרת או הוסף שעות למוסד"
          );
        });
    },
    getWeeklySum() {
      this.existHours = [];
      axios
        .get("/teacherEmploymentDetails/weekSumPerMossad", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAuth,
            begda: this.datesRange.min,
            endda: this.datesRange.max,
          },
        })
        .then((response) => {
          this.existHours.push({ type: 1, week: response.data });

          axios
            .get("/teacherEmploymentDetails/weekSum", {
              params: {
                empId: this.empId,
                begda: this.datesRange.min,
                endda: this.datesRange.max,
              },
            })
            .then((response) => {
              this.existHours.push({ type: 2, week: response.data });
            });
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
          this.filterReformTypeByMossad();
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
      this.datesRange.max = this.formatDate(new Date(this.selectedYear, 5, 20));
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
        this.$store.state.logginAuth,
        this.datesRange.min,
        this.datesRange.max
      );
    },
    navigateToHirePage() {
      this.$router.push("/HireEmp");
    },
    filterReformTypeByMossad() {
      if (this.$store.state.mossadInfo.mossadType == 2) {
        this.reformTypes = this.reformTypes.filter(
          (el) =>
            el.reformId == 1 ||
            el.reformId == 5 ||
            el.reformId == 7 ||
            el.reformId == 2 ||
            el.reformId == 8
        );
      } else if (this.$store.state.mossadInfo.mossadType == 1) {
        this.reformTypes = this.reformTypes.filter(
          (el) => el.reformId == 1 || el.reformId == 5 || el.reformId == 8
        );
      }
      this.reformTypes.filter;
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    changeText(index) {
      this.hoverText = this.existHours[1].week[index - 1];
    },
    testFunction() {
      axios.get("/");
    },
  },
  mixins: [excelMixin],
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
.divider {
  width: 98%;
  overflow: hidden;
  margin-top: 30px;
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
.excelMDI {
  color: green;
  background-color: lightgray;
}
.v-icon:hover {
  color: blue;
  display: "tete";
}
</style>
