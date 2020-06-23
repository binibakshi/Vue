<template>
  <div class="wrapper" v-show="Object.keys(this.empId).length >= 9">
    <h1 class="center">{{ _reformDiscription }}</h1>
    <div v-show="reformType != 0">
      <div class="first02">
        <br />
        <br />
        <table class="table" id="t01">
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
              <th>סך הכל</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in newHours" :key="index">
              <td>
                <a
                  v-if="row.type == frontalConst && index != 0"
                  @click="removeRow(index)"
                  >הסר</a
                >
              </td>
              <td>
                {{ convertReformDescription(row.type) }}
              </td>
              <td>
                <select
                  v-if="row.type == 1"
                  name="reformTypes"
                  id="reformTypesID"
                  v-model="row.code"
                  @change="setPrivateAndPauseCodes(row.code)"
                >
                  <option v-bind:value="row.code">
                    {{ row.code }}
                  </option>
                  <option
                    v-for="(HourCode, index) in _filteredCodes"
                    :key="index"
                    v-bind:value="HourCode.code"
                  >
                    {{ HourCode.code }}
                  </option>
                </select>
                <p v-if="row.type != 1">
                  {{ row.code }}
                </p>
              </td>

              <td class="frontalStyle">{{ currCodeDescription(row.code) }}</td>
              <td>
                <input
                  id="hours"
                  type="number"
                  v-model="row.hours"
                  :disabled="row.code <= 0 || row.type != frontalConst"
                  @input="getPauseAndPrivateHours(row.hours)"
                />
              </td>
              <td class="frontalStyle">
                <span v-if="row.type == frontalConst"
                  >{{ currOptionjobPercent(row.hours) }}%</span
                >
              </td>
              <td v-for="(cell, index2) in row.week" :key="index2">
                <input
                  type="number"
                  v-model="row.week[index2]"
                  :disabled="row.hours <= 0"
                />
              </td>
              <td
                :style="{
                  color: validRowsHours(row) == false ? 'red' : 'inherit',
                }"
              >
                {{ rowSum(row.week) }}
              </td>
            </tr>
            <tr class="summaryRow">
              <td></td>
              <td>סך</td>
              <td>--</td>
              <td>--</td>
              <td>{{ hoursAmount() }}</td>
              <td>{{ currOptionjobPercent(getAllFrontalHours()) }}%</td>
              <td v-for="(day, index) in parseInt(6)" :key="index">
                {{ dayAmount(day - 1) }}
              </td>
              <td
                :style="{
                  color: validTotalHours() == false ? 'red' : 'inherit',
                }"
              >
                {{ tableSum() }}
              </td>
            </tr>
          </tbody>
        </table>
        <v-row>
          <v-btn class="myBtn" color="success" @click="addNewRow()">הוסף</v-btn>
          <v-btn class="myBtn" color="info" @click="calcAllCodes()">חשב</v-btn>
          <v-btn class="myBtn" color="info" @click="saveHours()"
            >שמור שעות</v-btn
          >
          <v-spacer></v-spacer>
          <h4>סך שעות : {{ hoursAmount() }}</h4>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>

          <h4>סך אחוז משרה : {{ hoursAmount() }}</h4>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const FRONTAL = 1;
const PRIVATE = 2;
const PAUSE = 3;
export default {
  name: "weeklyHours",
  props: ["empId", "reformType"],

  data() {
    return {
      newHours: [
        { type: 1, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] },
        { type: 3, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] },
        { type: 2, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] },
      ],
      test: false,
      tableToSave: [],
      empOptions: [],
      reformTypes: [],
      jobPercent: 0,
      frontalHours: 0,
      employeeInfo: {},
      codeDescription: [],
      existHours: [],
      existHoursToDisplay: [],
      frontalConst: FRONTAL,
      privateConst: PRIVATE,
      pauseConst: PAUSE,
    };
  },
  created() {
    this.getCodeDescription();
    this.getReformTypes();
    this.getEmployeeOptions();
    this.getExistData();
  },
  methods: {
    getPauseAndPrivateHours(frontalHours) {
      this.newHours.find(
        (el) => el.type == this.pauseConst
      ).hours = this.empOptions.find(
        (el) => el.frontalHours == frontalHours
      ).pauseHours;
      this.newHours.find(
        (el) => el.type == this.privateConst
      ).hours = this.empOptions.find(
        (el) => el.frontalHours == frontalHours
      ).privateHours;
    },
    getCodeDescription() {
      axios
        .get("http://134.122.120.245:8080/ots-app/convertHours/byReform", {
          params: {
            reformType: this.reformType,
          },
        })
        .then((response) => {
          this.codeDescription = response.data;
        })
        .catch((error) => this.displayErrorMessage(error));
    },
    getReformTypes() {
      axios
        .get("http://134.122.120.245:8080/ots-app/reformTypes/relevant")
        .then((response) => {
          this.reformTypes = response.data;
        })
        .catch((error) => this.displayErrorMessage(error));
    },
    getEmployeeOptions() {
      axios
        .get("http://134.122.120.245:8080/ots-app/calcHours/options", {
          params: {
            reformType: this.reformType,
            empId: this.empId,
          },
        })
        .then((response) => {
          this.empOptions = response.data;
        })
        .catch((error) => this.displayErrorMessage(error));
    },
    getExistData() {
      axios
        .get(
          "http://134.122.120.245:8080/ots-app/teacherEmploymentDetails/byReform",
          {
            params: {
              empId: this.empId,
              mosadId: 2,
              reformType: this.reformType,
            },
          }
        )
        .then((response) => {
          this.existHours = response.data;
          if (this.existHours != null) {
            this.setExistHours();
          }
        })
        .catch((error) => this.displayErrorMessage(error));
    },
    setNewHoursForSave() {
      this.tableToSave = [];
      this.newHours.forEach((element) => {
        element.week.forEach((day, index) => {
          this.tableToSave.push({
            empId: this.empId,
            mosadId: 2,
            empCode: element.code,
            day: index,
            hours: day,
          });
        });
      });
    },
    setPrivateAndPauseCodes(code) {
      // OFEK HADASH
      if (code == 5466 || code == 5495) {
        this.newHours.find((el) => el.type == this.privateConst).code = 5468;
        this.newHours.find((el) => el.type == this.pauseConst).code = 5467;

        // OFEK HADASH replacement hours
      } else if (code == 3566) {
        this.newHours.find((el) => el.type == this.privateConst).code = 3567;
        this.newHours.find((el) => el.type == this.pauseConst).code = 3568;
        // OZ LETMURA
      } else if (code == 9600) {
        this.newHours.find((el) => el.type == this.privateConst).code = 9601;
        this.newHours.find((el) => el.type == this.pauseConst).code = 9602;
        // OZ LETMURA replacement hours
      } else if (code == 3900) {
        this.newHours.find((el) => el.type == this.privateConst).code = 3901;
        this.newHours.find((el) => el.type == this.pauseConst).code = 3902;
      } else {
        this.newHours.find((el) => el.type == this.privateConst).code = "";
        this.newHours.find((el) => el.type == this.pauseConst).code = "";
      }
    },
    setExistHours() {
      var index = 0;
      this.existHoursToDisplay = [];
      this.existHours.forEach((element) => {
        index = this.existHoursToDisplay.findIndex(
          (i) => i.code == element.empCode
        );
        if (index != null && index >= 0) {
          this.existHoursToDisplay[index].week[element.day] += element.hours;
          this.existHoursToDisplay[index].hours += element.hours;
        } else {
          this.existHoursToDisplay.push({
            type: this.codeDescription.find((el) => el.code == element.empCode)
              .hourType,
            hours: element.hours,
            code: element.empCode,
            week: [0, 0, 0, 0, 0, 0],
          });
          this.existHoursToDisplay.find((i) => i.code == element.empCode).week[
            element.day
          ] = element.hours;
        }
      });
      if (
        this.existHoursToDisplay != null &&
        this.existHoursToDisplay.length > 0
      ) {
        this.newHours = this.existHoursToDisplay;
        this.sortTable();
      }
    },
    removeRow(index) {
      if (index === 0) {
        return;
      }
      if (this.newHours[index].type != this.frontalConst) {
        return;
      }
      this.newHours.splice(index, index);
      this.getPauseAndPrivateHours();
    },
    addNewRow() {
      this.newHours.push({
        type: this.frontalConst,
        hours: 0,
        code: "",
        week: [0, 0, 0, 0, 0, 0],
      });
    },
    calcAllCodes() {
      this.frontalHours = 0;

      this.newHours.forEach((el) => {
        if (el.type == this.frontalConst) {
          if (!this.isNumber(el.hours)) {
            el.hours = 0;
          }
          this.frontalHours += parseInt(el.hours);
        }
      });
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
        .filter((el) => el.type == this.frontalConst)
        .reduce((sum, record) => sum + record.hours, 0);
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
      var isSaved = false;
      this.setNewHoursForSave();
      if (this.tableToSave.length <= 0) {
        console.log("no data");
        return;
      }
      console.log(this.tableToSave)
      axios({
        url:
          "http://134.122.120.245:8080/ots-app/teacherEmploymentDetails/saveAll",
        method: "post",
        data: this.tableToSave,
      })
        .then((response) => {
          console.log(response.data);
          isSaved = true;
        })
        .catch((error) => {
          this.displayErrorMessage(error)
        });
      return isSaved;
    },
    convertReformDescription(reform) {
      if (reform == this.privateConst) {
        return "פרטני";
      } else if (reform == this.pauseConst) {
        return "שהייה";
      } else {
        return "פרונטלי";
      }
    },

    validRowsHours(row) {
      if (row.hours != undefined && row.hours != this.rowSum(row.week)) {
        return false;
      }
      return true;
    },
    validTotalHours() {
      if (this.hoursAmount() != this.tableSum()) {
        return false;
      }
      return true;
    },
    rowSum(weekArray) {
      return weekArray.reduce((acc, item) => parseInt(acc) + parseInt(item), 0);
    },
    tableSum() {
      return this.newHours.reduce(
        (acc, item) => parseInt(acc) + this.rowSum(item.week),
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
      displayErrorMessage(error){
    if (error.response.data.errorMessage == undefined) {
      console.log(error)
    } else {
      alert(error.response.data.errorMessage)
    }
  }
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
          el.hourType == this.frontalConst &&
          !this.newHours.find((i) => i.code == el.code)
      );
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 1200px;
  overflow: hidden; /* will contain if #first is longer than #second */
  margin-right: 2%;
  margin-bottom: 2%;
  /* max-width: 95%; */
}
.second02 {
  margin: 5px;
  overflow: hidden; /* if you don't want #second to wrap below #first */
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
  margin: 1px;
}
table {
  max-width: 98%;
}

.center {
  margin: auto;
  width: 50%;
  padding: 10px;
}
.summaryRow {
  background: darkcyan;
  lighting-color: darkcyan;
}
/* input.disable-input {
  background-color: gray;
} */
</style>
