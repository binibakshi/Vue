<template>
  <v-card>
    <div class="littleMargin">
      <v-row id="mossadHoursDetails">
        <v-col cols="12" md="2">
          <p>מוסד - {{_mossadInfo.mossadName}}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>שעות מאוישות - {{_mossadInfo.currHours}}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>יתרת שעות - {{_mossadInfo.maxHours - _mossadInfo.currHours}}</p>
        </v-col>
        <v-col cols="12" md="3">
          <p>כמות שעות מקסימלית - {{_mossadInfo.maxHours}}</p>
        </v-col>
        <v-col cols="12" md="2">
          <p>אחוז איוש - {{ getTwoDigits((_mossadInfo.currHours /_mossadInfo.maxHours) * 100) }}%</p>
        </v-col>
      </v-row>
      <v-row id="serchEmployee">
        <v-col cols="12" md="8">
          <v-autocomplete
            v-model="empId"
            :items="tzArray"
            color="indigo lighten-5"
            hide-selected
            :item-text="item => item.firstName +' '+ item.lastName + ' - ' + item.empId"
            item-value="empId"
            label="תעודת זהות"
            placeholder="חפש"
            @change="getEmployeeInfo()"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="second" v-if="Object.keys(this.employeeInfo).length > 0">
        <v-col cols="12" md="2">
          <p>שם פרטי</p>
          {{ employeeInfo.firstName }}
        </v-col>
        <v-col cols="12" md="2">
          <p>שם משפחה</p>
          {{ employeeInfo.lastName }}
        </v-col>
        <v-col cols="12" md="1">
          <p>גיל</p>
          {{ formatDate }}
        </v-col>
        <v-col cols="12" md="1">
          <p>מין</p>
          {{ formatGender }}
        </v-col>
        <v-col cols="12" md="1">
          <p>משרת אם</p>
          {{ formatIsMother }}
        </v-col>
        <v-col cols="12" md="1">
          <p>שעות גיל</p>
          {{ ageHours }}
        </v-col>
        <v-col cols="12" md="4">
          <table id="detailsTable" v-if="Object.keys(this.existHours).length > 0">
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
                <td>{{getRowType(row.type)}}</td>
                <td v-for="index in 6" :key="index">{{ row.week[index - 1] }}</td>
                <td>{{ totalHours(row.week) }}</td>
                <td>{{ getTwoDigits(row.week[6]) }}%</td>
              </tr>
            </tbody>
          </table>
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
        <v-spacer></v-spacer>
        <v-btn color="success" @click="exportEmployeeWeeklyHours()">ייצא איוש שעות לאקסל</v-btn>
      </v-row>
      <v-card v-if="employeeInfo != null && selectedReforms != null">
        <v-card class="center" v-for="(reform,index) in selectedReforms" :key="index">
          <weeklyHours :empId="empId" :reformType="reform"></weeklyHours>
        </v-card>
      </v-card>
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
      empId: null,
      tzArray: [],
      employeeInfo: {},
      existHours: [],
      weeklyHoursComponents: [],
      reformTypes: [],
    };
  },
  created() {
    this.getAllTz();
    this.getReformTypes();
  },
  mounted() {
    bus.$on("changeWeeklyHours", () => {
      this.getWeeklySum();
    });
  },
  computed: {
    _mossadInfo() {
      if (this.$store.getters.mossadInfo == null) {
        let temp = { mossadName: "" };
        return temp;
      }
      return this.$store.state.mossadInfo;
    },
    formatDate() {
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
    ageHours() {
      // TODO
      if (this.employeeInfo.birthDate === undefined) {
        return null;
      }
      var birthDate = new Date(this.employeeInfo.birthDate);
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
  methods: {
    totalHours(week) {
      let sum = 0;

      if (week != null) {
        for (let index = 0; index < 6; index++) {
          sum = sum + parseInt(week[index]);
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
    getWeeklySum() {
      this.existHours = [];
      axios
        .get("/teacherEmploymentDetails/weekSumPerMossad", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAuth,
          },
        })
        .then((response) => {
          this.existHours.push({ type: 1, week: response.data });

          axios
            .get("/teacherEmploymentDetails/weekSum", {
              params: {
                empId: this.empId,
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
    exportEmployeeWeeklyHours() {
      // call function in the mixin
      this.createWeeklyHoursToEmployee(
        this.empId,
        this.$store.state.logginAuth
      );
    },
    navigateToHirepage() {
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
  margin-left: 15%;
  margin-right: auto;
}
</style>
