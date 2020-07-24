<template>
  <div class="wrapper" v-show="Object.keys(this.empId).length > 0">
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
                <a v-if="row.type == frontalConst && index != 0" @click="removeRow(index)">הסר</a>
              </td>
              <td>{{ convertReformDescription(row.type) }}</td>
              <td id="test">
                <v-autocomplete
                  v-if="row.type == frontalConst"
                  v-model="row.code"
                  :items="_filteredCodes"
                  hide-no-data
                  hide-selected
                  :item-text="item => item.code +'-'+ item.codeDescription"
                  item-value="code"
                  @change="setPrivateAndPauseCodes(row.code)"
                >row.code</v-autocomplete>
                <p>{{ row.code }}</p>
              </td>

              <td class="frontalStyle">{{ currCodeDescription(row.code) }}</td>
              <td>
                <input
                  id="hours"
                  type="number"
                  v-model="row.hours"
                  :disabled="row.code <= 0 || row.type != frontalConst"
                  @input="getPauseAndPrivateHours()"
                />
              </td>
              <td class="frontalStyle"></td>
              <td v-for="(cell, index2) in row.week" :key="index2">
                <input type="number" v-model="row.week[index2]" :disabled="row.hours <= 0" />
              </td>
              <td
                :style="{
                  color: validRowsHours(row) == false ? 'red' : 'inherit',
                }"
              >{{ rowSum(row.week) }}</td>
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
              >{{ tableSum() }}</td>
            </tr>
          </tbody>
        </table>
        <v-row>
          <v-btn class="myBtn" color="success" @click="addNewRow()">הוסף</v-btn>
          <v-btn class="myBtn" color="info" @click="saveHours()">שמור שעות</v-btn>
          <v-btn class="myBtn" color="red" @click="initilizer()">נקה</v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <p>סך שעות : {{ hoursAmount() }}</p>
            <p>סך אחוז משרה : {{ currOptionjobPercent(getAllFrontalHours()) }}%</p>
          </v-col>
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
      newHours: [],
      tableToSave: [],
      empOptions: [],
      reformTypes: [],
      jobPercent: 0,
      frontalHours: 0,
      codeDescription: [],
      existHours: [],
      frontalConst: FRONTAL
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
      var totalFrontalHours = this.newHours
        .filter(el => el.type == FRONTAL)
        .reduce((sum, record) => sum + parseInt(record.hours), 0);

      this.newHours.find(el => el.type == PAUSE).hours = this.empOptions.find(
        el => el.frontalHours == totalFrontalHours
      ).pauseHours;

      this.newHours.find(el => el.type == PRIVATE).hours = this.empOptions.find(
        el => el.frontalHours == totalFrontalHours
      ).privateHours;
    },
    getCodeDescription() {
      axios
        .get("/convertHours/byReform", {
          params: {
            reformType: this.reformType
          }
        })
        .then(response => {
          this.codeDescription = response.data;
        })
        .catch(error => this.$store.dispatch("displayErrorMessage", {
            error,
          }));
    },
    getReformTypes() {
      axios
        .get("/reformTypes/relevant")
        .then(response => {
          this.reformTypes = response.data;
        })
        .catch(error => this.$store.dispatch("displayErrorMessage", {
            error,
          }));
    },
    getEmployeeOptions() {
      axios
        .get("/calcHours/options", {
          params: {
            reformType: this.reformType,
            empId: this.empId
          }
        })
        .then(response => {
          this.empOptions = response.data;
        })
        .catch(error => this.$store.dispatch("displayErrorMessage", {
            error,
          }));
    },
    async getExistData() {
      axios
        .get(
          "/teacherEmploymentDetails/byReform",
          {
            params: {
              empId: this.empId,
              mosadId: 13,
              reformType: this.reformType
            }
          }
        )
        .then(response => {
          this.existHours = response.data;
          if (this.existHours != null) {
            this.setExistHours();
          }
        })
        .catch(error => this.$store.dispatch("displayErrorMessage", {
            error,
          }));
    },
    setNewHoursForSave() {
      this.tableToSave = [];
      this.newHours.forEach(element => {
        element.week.forEach((day, index) => {
          this.tableToSave.push({
            empId: this.empId,
            mosadId: 13,
            empCode: element.code,
            day: index,
            hours: day
          });
        });
      });
    },
    setPrivateAndPauseCodes(code) {
      // OFEK HADASH
      if (code == 5466 || code == 5495) {
        this.newHours.find(el => el.type == PAUSE).code = 5468;
        this.newHours.find(el => el.type == PRIVATE).code = 5467;

        // OFEK HADASH replacement hours
      } else if (code == 3566) {
        this.newHours.find(el => el.type == PRIVATE).code = 3567;
        this.newHours.find(el => el.type == PAUSE).code = 3568;
        // OZ LETMURA
      } else if (code == 9600) {
        this.newHours.find(el => el.type == PRIVATE).code = 9601;
        this.newHours.find(el => el.type == PAUSE).code = 9602;
        // OZ LETMURA replacement hours
      } else if (code == 3900) {
        this.newHours.find(el => el.type == PRIVATE).code = 3901;
        this.newHours.find(el => el.type == PAUSE).code = 3902;
      } else {
        this.newHours.find(el => el.type == PRIVATE).code = "";
        this.newHours.find(el => el.type == PAUSE).code = "";
      }
    },
    setExistHours() {
      let tempHourType;
      let newRow = {};

      this.existHours.forEach(el => {
        tempHourType = this.codeDescription.find(e => e.code == el.empCode)
          .hourType;
        // check if first insert and if need to create new row(for frontal only)
        if (
          tempHourType == FRONTAL &&
          this.newHours.find(e => e.type == tempHourType).code != ""
        ) {
          // after first insert check whether create new row or add to existing one
          if (this.newHours.find(e => e.code == el.empCode) == undefined) {
            newRow = {
              type: FRONTAL,
              hours: el.hours,
              code: el.empCode,
              week: [0, 0, 0, 0, 0, 0]
            };
            newRow.week[el.day] = el.hours;
            this.newHours.push(newRow);
          } else {
            this.newHours.find(e => e.code == el.empCode).hours += el.hours;
          }
        } else {
          this.newHours.find(e => e.type == tempHourType).week[el.day] =
            el.hours;
          this.newHours.find(e => e.type == tempHourType).hours += el.hours;
          this.newHours.find(e => e.type == tempHourType).code = el.empCode;
        }
      });
      this.setPrivateAndPauseCodes(
        this.newHours.find(el => el.type == FRONTAL).code
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
      this.newHours.splice(index, index);
      this.getPauseAndPrivateHours();
    },
    addNewRow() {
      this.newHours.push({
        type: FRONTAL,
        hours: 0,
        code: "",
        week: [0, 0, 0, 0, 0, 0]
      });
      this.sortTable();
    },
    calcAllCodes() {
      this.frontalHours = 0;

      this.newHours.forEach(el => {
        if (el.type == FRONTAL) {
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
        if (this.codeDescription.find(e => e.code == index) === undefined) {
          return "";
        }
        return this.codeDescription.find(e => e.code == index).codeDescription;
      }
      return "";
    },
    getAllFrontalHours() {
      return this.newHours
        .filter(el => el.type == FRONTAL)
        .reduce((sum, record) => sum + parseInt(record.hours), 0);
    },
    currOptionjobPercent(frontalHours) {
      if (frontalHours != undefined && frontalHours > 0) {
        if (
          this.empOptions.find(e => e.frontalHours == frontalHours) ===
          undefined
        ) {
          return 0;
        }
        return this.empOptions.find(e => e.frontalHours == frontalHours)
          .jobPercent;
      }
      return 0;
    },
    saveHours() {
      var isSaved = false;
      //check all data before let user to save
      let isValid = true;
      this.newHours.forEach(row => {
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
      if (this.tableToSave.length <= 0) {
        console.log("no data");
        return;
      }
      axios({
        url:
          "/teacherEmploymentDetails/saveAll",
        method: "post",
        data: this.tableToSave
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          isSaved = true;
        })
        .catch(error => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      return isSaved;
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
        .filter(el => this.isNumber(el.hours))
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
          { type: PAUSE, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] }
        ];
      } else {
        this.newHours = [
          { type: FRONTAL, hours: 0, code: "", week: [0, 0, 0, 0, 0, 0] }
        ];
      }
    },
  },
  computed: {
    _reformDiscription() {
      var name = this.reformTypes.find(el => el.reformId == this.reformType);
      if (name != undefined) {
        return name.name;
      }
      return "";
      // return this.reformTypes[0].name;
    },
    _filteredCodes() {
      return this.codeDescription.filter(
        el =>
          el.hourType == FRONTAL && !this.newHours.find(i => i.code == el.code)
      );
    }
  },
  watch: {
    empId: function(val) {
      this.empId = val;
      this.initilizer();
      this.getExistData();
    }
  }
};
</script>

<style scoped>
#test {
  max-width: 100px ;
  max-height: 25px ;
  padding-top: 0;
}
.wrapper {
  width: 1200px;
  overflow: hidden; /* will contain if #first is longer than #second */
  margin-right: 2%;
  margin-bottom: 2%;
  /* max-width: 95%; */
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
p {
  font-weight: bold;
  text-decoration: underline;
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
