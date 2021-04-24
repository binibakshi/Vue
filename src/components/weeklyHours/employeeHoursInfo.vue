<template>
  <div>
    <div class="wrapper-grid">
      <div class="grid-element">
        <p>שם פרטי</p>
        {{ employeeInfo.firstName }}
      </div>
      <div class="grid-element">
        <p>שם משפחה</p>
        {{ employeeInfo.lastName }}
      </div>
      <div class="grid-element">
        <p>גיל</p>
        {{ getAge() }}
      </div>
      <!-- <div class="grid-element">
        <p>משרת אם</p>
        {{ formatIsMother() }}
      </div> -->
      <div class="grid-element">
        <p>שעות גיל</p>
        {{ getAgeHours() }}
      </div>
      <div class="grid-element">
        <div class="detailsTable">
          <table>
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
        </div>
        <div class="underTableDiv">
          <div class="workInReform">
            <p v-for="reform in workInReforms" :key="reform">
              {{ getRreformDiscription(reform) + ", " }}
            </p>
          </div>
          <div>
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
          </div>
        </div>
      </div>
      <div class="grid-element">
        <p>אחוז קביעות</p>
        <router-link
          title="דף אחוז קביעות משרה"
          :to="{ name: 'setJobPercent' }"
          >{{ estimateJobPercent }}%
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import excelMixin from "../../mixins/excelMixin";
import axios from "axios";
export default {
  props: [
    "employeeInfo",
    "empHoursTable",
    "estimateJobPercent",
    "workInReforms",
    "datesRange",
    "reformTypes",
  ],
  mixins: [excelMixin],
  data() {
    return {
      hoverText: "",
      mossadot: [],
    };
  },
  created() {
    this.getMossadot();
  },
  methods: {
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
    exportEmployeeWeeklyHours() {
      // call function in the mixin
      this.createWeeklyHoursToEmployee(
        this.employeeInfo.empId,
        this.$store.state.logginAs,
        this.datesRange.min,
        this.datesRange.max
      );
    },
    getAge() {
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
    getAgeHours() {
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
    getRowType(type) {
      if (type === 0) {
        return "במוסד";
      }
      return "בכל המוסדות";
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
    getRreformDiscription(reform) {
      var name = this.reformTypes.find((el) => el.reformId == reform);
      if (name != undefined) {
        return name.name;
      }
      return "";
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    isNotEmpty(obj) {
      for (var i in obj) return false;
      return true;
    },
  },
};
</script>

<style scoped>
p {
  font-weight: bold;
}
.wrapper-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 4fr 1fr;
}

.wrapper-grid > div {
  margin-right: 0.7em;
  margin-left: 0.7em;
}
.underTableDiv {
  margin-top: 15px;
  display: grid;
  grid-template-columns: 5fr 1fr;
}
.detailsTable {
  display: inline-flex;
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
  max-width: auto;
  text-align: center;
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