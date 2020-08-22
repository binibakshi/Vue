<template>
  <div v-if="empId != null">
    <h1 id="centerize">{{ _reformDiscription }}</h1>
    <div v-show="reformType != 0">
      <div>
        <table id="t01">
          <thead>
            <tr>
              <th></th>
              <th>סוג</th>
              <th>קוד פיצול</th>
              <th>תיאור קוד פיצול</th>
              <th>שעות</th>
              <th>אחוז משרה</th>
              <th>א'</th>
              <th>ב'</th>
              <th>ג'</th>
              <th>ד'</th>
              <th>ה'</th>
              <th>ו'</th>
              <th>הפרש</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in newHours" :key="index">
              <td>
                <a v-if="row.type == frontalConst && index != 0" @click="removeRow(index)">הסר</a>
              </td>
              <td>{{ convertReformDescription(row.type) }}</td>
              <td id="autocomlete">
                <v-autocomplete
                  v-if="row.type == frontalConst"
                  v-model="row.code"
                  :items="_filteredCodes"
                  hide-no-data
                  hide-selected
                  :item-text="item => item.code + '-' + item.codeDescription"
                  item-value="code"
                  @change="setPrivateAndPauseCodes(row.code)"
                ></v-autocomplete>

                <p>{{row.code }}</p>
              </td>
              <td class="frontalStyle">{{ currCodeDescription(row.code) }}</td>
              <td>
                <input
                  id="hours"
                  type="number"
                  min="0"
                  v-model="row.hours"
                  :disabled="row.code <= 0 || row.type != frontalConst"
                  @input="getPauseAndPrivateHours()"
                />
              </td>
              <td class="frontalStyle"></td>
              <td v-for="(cell, index2) in row.week" :key="index2">
                <input
                  type="number"
                  min="0"
                  v-model="row.week[index2]"
                  :disabled="row.hours <= 0"
                />
              </td>
              <td
                :style="{
                  color: validRowsHours(row) == false ? 'red' : 'inherit',
                }"
              >{{ leftHours(row) }}</td>
            </tr>
            <tr class="summaryRow">
              <td></td>
              <td>סך</td>
              <td>--</td>
              <td>--</td>
              <td>{{ hoursAmount() }}</td>
              <td>{{ currOptionjobPercent(getAllFrontalHours()) }}%</td>
              <td v-for="(day, index) in parseInt(6)" :key="index">{{ dayAmount(day - 1) }}</td>
              <td
                :style="{
                  color: validTotalHours() == false ? 'red' : 'inherit',
                }"
              >{{ leftTableHours() }}</td>
            </tr>
          </tbody>
        </table>
        <v-btn class="myBtn" color="success" @click="addNewRow()">הוסף שורה</v-btn>
        <v-btn class="myBtn" color="info" @click="saveHours()">שמור שעות</v-btn>
        <v-btn class="myBtn" color="red" @click="cleanWeeklyData()">נקה</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../main";

const FRONTAL = 1;
const PRIVATE = 2;
const PAUSE = 3;

export default {
  name: "weeklyHours",
  props: ["empId", "reformType"],

  data() {
    return {
      newHours: [],
      tableToSave: [],
      empOptions: [],
      reformTypes: [],
      codeDescription: [],
      existHours: [],
      frontalConst: FRONTAL,
    };
  },
  created() {
    this.initilizer();
    this.getCodeDescription();
    this.getReformTypes();
    this.getEmployeeOptions();
    this.getExistData();
  },
  methods: {
    getPauseAndPrivateHours() {
      if (this.reformType != 2 && this.reformType != 5) {
        return;
      }
      var totalFrontalHours = Math.round(
        this.newHours
          .filter((el) => el.type == FRONTAL)
          .reduce((sum, record) => sum + parseInt(record.hours), 0)
      );

      this.newHours.find((el) => el.type == PAUSE).hours = this.empOptions.find(
        (el) => el.frontalHours == totalFrontalHours
      ).pauseHours;

      this.newHours.find(
        (el) => el.type == PRIVATE
      ).hours = this.empOptions.find(
        (el) => el.frontalHours == totalFrontalHours
      ).privateHours;
    },
    getCodeDescription() {
      axios
        .get("/convertHours/byReform", {
          params: {
            reformType: this.reformType,
          },
        })
        .then((response) => {
          this.codeDescription = response.data;
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
    getEmployeeOptions() {
      axios
        .get("/calcHours/options", {
          params: {
            reformType: this.reformType,
            empId: this.empId,
          },
        })
        .then((response) => {
          this.empOptions = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getExistData() {
      axios
        .get("/teacherEmploymentDetails/byReform", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAuth,
            reformType: this.reformType,
          },
        })
        .then((response) => {
          this.existHours = response.data;
          if (this.existHours != null) {
            this.setExistHours();
          }
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    setNewHoursForSave() {
      this.tableToSave = [];
      this.newHours.forEach((element) => {
        element.week.forEach((day, index) => {
          this.tableToSave.push({
            empId: this.empId,
            mossadId: this.$store.state.logginAuth,
            empCode: element.code,
            day: index,
            hours: day,
          });
        });
      });
    },
    setPrivateAndPauseCodes(code) {
      if ((this.reformType != 2 && this.reformType != 5) || code == "") {
        return;
      }
      // OZ LETMURA
      if (this.reformType == 5) {
        this.newHours.find((el) => el.type == PRIVATE).code = 9601;
        this.newHours.find((el) => el.type == PAUSE).code = 9602;
      }
      // OFEK HADASH
      else if (this.reformType == 2) {
        this.newHours.find((el) => el.type == PAUSE).code = 5468;
        this.newHours.find((el) => el.type == PRIVATE).code = 5467;
      }
    },
    setExistHours() {
      let tempHourType;
      let newRow = {};

      this.existHours.forEach((el) => {
        tempHourType = this.codeDescription.find((e) => e.code == el.empCode)
          .hourType;
        // check if first insert and if need to create new row(for frontal only)
        if (
          tempHourType == FRONTAL &&
          this.newHours.find((e) => e.type == tempHourType).code != ""
        ) {
          // after first insert check whether create new row or add to existing one
          if (this.newHours.find((e) => e.code == el.empCode) == undefined) {
            newRow = {
              type: FRONTAL,
              hours: el.hours,
              code: el.empCode,
              week: [0, 0, 0, 0, 0, 0],
            };
            newRow.week[el.day] = el.hours;
            this.newHours.push(newRow);
          } else {
            this.newHours.find((e) => e.code == el.empCode).hours += el.hours;
            this.newHours.find((e) => e.code == el.empCode).week[el.day] +=
              el.hours;
          }
        } else {
          this.newHours.find((e) => e.type == tempHourType).week[el.day] =
            el.hours;
          this.newHours.find((e) => e.type == tempHourType).hours += el.hours;
          this.newHours.find((e) => e.type == tempHourType).code = el.empCode;
        }
      });
      this.setPrivateAndPauseCodes(
        this.newHours.find((el) => el.type == FRONTAL).code
      );
      this.sortTable();
    },
    removeRow(index) {
      if (index === 0) {
        return;
      }
      if (this.newHours[index].type != FRONTAL) {
        return;
      }
      this.newHours.splice(index, 1);
      this.getPauseAndPrivateHours();
    },
    addNewRow() {
      this.newHours.push({
        type: FRONTAL,
        hours: 0,
        code: "",
        week: [0, 0, 0, 0, 0, 0],
      });
      this.sortTable();
    },
    sortTable() {
      this.newHours.sort((a, b) => a.type - b.type);
    },
    isNumber(n) {
      return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    },
    currCodeDescription(index) {
      if (index != undefined && index > 0) {
        if (this.codeDescription.find((e) => e.code == index) === undefined) {
          return "";
        }
        return this.codeDescription.find((e) => e.code == index)
          .codeDescription;
      }
      return "";
    },
    getAllFrontalHours() {
      return this.newHours
        .filter((el) => el.type == FRONTAL)
        .reduce((sum, record) => sum + parseInt(record.hours), 0);
    },
    currOptionjobPercent(frontalHours) {
      if (frontalHours != undefined && frontalHours > 0) {
        if (
          this.empOptions.find((e) => e.frontalHours == frontalHours) ===
          undefined
        ) {
          return 0;
        }
        return this.empOptions.find((e) => e.frontalHours == frontalHours)
          .jobPercent;
      }
      return 0;
    },
    saveHours() {
      //check all data before let user to save
      let isValid = true;
      this.newHours.forEach((row) => {
        if (this.validRowsHours(row) == false) {
          isValid = false;
          return;
        }
      });
      if (isValid == false) {
        alert("יש למלא שעות תקינות");
        return false;
      }
      this.setNewHoursForSave();
      axios({
        url: "/teacherEmploymentDetails/saveAll",
        method: "post",
        data: this.tableToSave,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          bus.$emit("changeWeeklyHours");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    convertReformDescription(reform) {
      if (reform == PRIVATE) {
        return "פרטני";
      } else if (reform == PAUSE) {
        return "שהייה";
      } else {
        return "פרונטלי";
      }
    },
    validRowsHours(row) {
      if (row.hours != undefined && this.leftHours(row) != 0) {
        return false;
      }
      return true;
    },
    validTotalHours() {
      if (0 != this.leftTableHours()) {
        return false;
      }
      return true;
    },
    leftHours(row) {
      var weekArray = row.week;
      return (
        parseInt(
          weekArray.reduce((acc, item) => parseInt(acc) + parseInt(item), 0)
        ) - row.hours
      );
    },
    leftTableHours() {
      return this.newHours.reduce(
        (acc, item) => parseInt(acc) + this.leftHours(item),
        0
      );
    },
    hoursAmount() {
      return this.newHours
        .filter((el) => this.isNumber(el.hours))
        .reduce((acc, item) => parseInt(acc) + parseInt(item.hours), 0);
    },
    dayAmount(day) {
      return this.newHours.reduce(
        (acc, item) => parseInt(acc) + parseInt(item.week[day]),
        0
      );
    },
    initilizer() {
      this.newHours = [];
      if (this.reformType == 5 || this.reformType == 2) {
        this.newHours = [
          { type: FRONTAL, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] },
          { type: PRIVATE, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] },
          { type: PAUSE, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] },
        ];
      } else {
        this.newHours = [
          { type: FRONTAL, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] },
        ];
      }
    },
    cleanWeeklyData() {
      this.newHours.forEach((el) => {
        el.hours = 0;
        el.week = [0, 0, 0, 0, 0, 0];
      });
    },
  },
  computed: {
    _reformDiscription() {
      var name = this.reformTypes.find((el) => el.reformId == this.reformType);
      if (name != undefined) {
        return name.name;
      }
      return "";
      // return this.reformTypes[0].name;
    },
    _filteredCodes() {
      return this.codeDescription.filter(
        (el) =>
          el.hourType == FRONTAL &&
          !this.newHours.find((i) => i.code == el.code)
      );
    },
  },
  watch: {
    empId: function (val) {
      this.empId = val;
      this.initilizer();
      this.getCodeDescription();
      this.getEmployeeOptions();
      this.getExistData();
    },
    reformType: function (val) {
      this.reformType = val;
      this.initilizer();
      this.getCodeDescription();
      this.getEmployeeOptions();
      this.getExistData();
    },
  },
};
</script>

<style scoped>
#autocomlete {
  max-width: 150px;
  max-height: 25px;
  padding-top: 0;
}

table,
tr,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  font-weight: bold;
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
input {
  /* border: 1px solid; */
  max-width: 50px;
}
table#t01 td:nth-child() {
  background-color: #eee;
}
.frontalStyle {
  background-color: #fafad2;
}
option,
select {
  border: 1px solid black;
}
input:disabled {
  background-color: #eff0f1;
}
.myBtn {
  padding: 1px;
  margin: 5px;
  /* margin-left: 10px; */
}
table {
  max-width: 98%;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
p {
  font-weight: bold;
  text-decoration: underline;
}
#centerize {
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
}
.summaryRow {
  background: darkcyan;
  lighting-color: darkcyan;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
