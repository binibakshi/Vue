<template>
  <div v-if="empId != null && reformType != 0">
    <table id="t01">
      <thead>
        <tr>
          <th></th>
          <th>סוג</th>
          <th>קוד פיצול</th>
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
            <div id="additionalActions">
              <v-icon
                id="myPlusIcon"
                dense
                @click="addNewRow()"
                v-if="row.type == frontalConst"
                >mdi-plus-circle-outline</v-icon
              >
              <v-icon
                id="myMinusIcon"
                dense
                @click="removeRow(index)"
                v-if="row.type == frontalConst"
                >mdi-minus-circle-outline</v-icon
              >
            </div>
          </td>
          <td>{{ convertReformDescription(row.type) }}</td>
          <td style="padding-right: 10px">
            <v-autocomplete
              class="mySelectOption"
              v-if="row.type == frontalConst"
              v-model="row.code"
              :items="relevantCodes(row)"
              hide-selected
              :item-text="(item) => item.code + ' - ' + item.codeDescription"
              item-value="code"
              @change="onCodeSelect(row)"
            ></v-autocomplete>
            <h4 style="text-align: right" v-if="row.type != frontalConst">
              {{ row.code }} - {{ currCodeDescription(row.code) }}
            </h4>
          </td>
          <td>
            <router-link
              v-if="isBagrutReward(row.code)"
              @click.native="beforeOpenRewards"
              title="מעבר לגמולי בגרות"
              :to="{ name: 'AdditionalRewards' }"
              target="_blank"
            >
              {{ row.hours }}
            </router-link>
            <router-link
              v-if="isJobReward(row.code)"
              @click.native="beforeOpenRewards"
              title="מעבר לגמולי שעות"
              :to="{ name: 'jobRewards' }"
              target="_blank"
            >
              {{ row.hours }}
            </router-link>
            <input
              v-if="!isRewradHours(row.code)"
              id="hours"
              type="number"
              min="0"
              step="0.1"
              v-model="row.hours"
              :disabled="
                row.code <= 0 ||
                row.type != frontalConst ||
                isRewradHours(row.code)
              "
              @input="getPauseAndPrivateHours()"
            />
          </td>
          <td class="disableStyle"></td>
          <td v-for="(cell, index2) in row.week" :key="index2">
            <input
              type="number"
              min="0"
              step="0.1"
              v-model="row.week[index2]"
              :disabled="row.hours <= 0"
            />
          </td>
          <td
            class="disableStyle"
            :style="{
              color: validRowsHours(row) == false ? 'red' : 'inherit',
            }"
          >
            {{ getTwoDigits(leftHours(row)) }}
          </td>
        </tr>
        <tr class="summaryRow">
          <td></td>
          <td>סך</td>
          <td>--</td>
          <td>{{ hoursAmount() }}</td>
          <td>
            {{
              getTwoDigits(
                this.calcJobPercent(
                  this.reformType,
                  this.hoursAmount(),
                  this.ageHours,
                  this.isMother
                )
              )
            }}%
          </td>
          <td v-for="(day, index) in parseInt(6)" :key="index">
            {{ dayAmount(day - 1) }}
          </td>
          <td
            :style="{
              color: validTotalHours() == false ? 'red' : 'inherit',
            }"
          >
            {{ getTwoDigits(leftTableHours()) }}
          </td>
        </tr>
      </tbody>
    </table>
    <v-row class="center" style="margin-top: auto; margin-bottom: auto">
      <v-btn class="myBtn" color="primary" @click="saveHours()"
        >שמור שעות</v-btn
      >
      <v-btn class="myBtn" color="" @click="cleanWeeklyData()">נקה</v-btn>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";
import calcHoursMixin from "../../mixins/calcHoursMixin";

const FRONTAL = 1;
const PRIVATE = 2;
const PAUSE = 3;

export default {
  name: "weeklyHours",
  props: [
    "empId",
    "reformType",
    "isMother",
    "ageHours",
    "existData",
    "begda",
    "endda",
    "codeDescription",
    "jobRewardTypes",
    "rewardsHours",
  ],
  data() {
    return {
      newHours: [],
      tableBegda: "",
      tableEndda: "",
      datesRange: {
        min: "",
        max: "",
      },
      tableToSave: [],
      tablesArray: [],
      empOptions: [],
      reformTypes: [],
      frontalCodes: [],
      frontalConst: FRONTAL,
    };
  },

  async mounted() {
    this.initilizer();
    await this.getEmployeeOptions();
    this.setFrontalCodes();
    this.setBegdaEndda();
    this.setExistData();
    this.setExistRewards();
    this.setPrivateAndPauseCodes(
      this.newHours.find((el) => el.type == FRONTAL).code
    );
    this.sortTable();
  },
  methods: {
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
    getPauseAndPrivateHours() {
      if (this.reformType != 2 && this.reformType != 5) {
        return;
      }
      var totalFrontalHours = Math.round(
        this.newHours
          .filter((el) => el.type == FRONTAL)
          .reduce((sum, record) => sum + parseFloat(record.hours), 0)
      );
      if (totalFrontalHours <= 0) {
        return;
      }
      this.newHours.find((el) => el.type == PAUSE).hours = this.empOptions.find(
        (el) => el.frontalHours == totalFrontalHours
      ).pauseHours;

      this.newHours.find(
        (el) => el.type == PRIVATE
      ).hours = this.empOptions.find(
        (el) => el.frontalHours == totalFrontalHours
      ).privateHours;
    },
    async getEmployeeOptions() {
      await axios
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
    setNewHoursForSave() {
      this.tableToSave = [];
      this.newHours.forEach((element) => {
        element.week.forEach((day, index) => {
          this.tableToSave.push({
            empId: this.empId,
            mossadId: this.$store.state.logginAs,
            changedBy: this.$store.state.username,
            empCode: element.code,
            begda: new Date(this.begda),
            endda: new Date(this.endda),
            day: index,
            hours: day,
          });
        });
      });
    },
    onCodeSelect(row) {
      row.hours = 0;
      // if code is bagrut/job reward check if has and set the hours amount
      if (this.isRewradHours(row.code)) {
        row.hours = this.rewardsHours
          .filter((el) => el.employmentCode == row.code)
          .reduce((sum, e) => (sum += parseFloat(e.hours)), 0);
        this.getPauseAndPrivateHours();
      }
      this.setPrivateAndPauseCodes(row.code);
    },
    beforeOpenRewards() {
      this.$store.dispatch("setEmpId", this.empId);
      this.$store.dispatch(
        "setSelectedYear",
        new Date(this.endda).getFullYear()
      );
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
    setExistData() {
      let tempHourType;
      let newRow = {};

      this.existData.forEach((el) => {
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
              hours: 0,
              code: el.empCode,
              week: [0, 0, 0, 0, 0, 0],
            };
            if (!this.isRewradHours(el.empCode)) {
              newRow.hours = el.hours;
            }
            newRow.week[el.day] = el.hours;
            this.newHours.push(newRow);
          } else {
            if (!this.isRewradHours(el.empCode)) {
              this.newHours.find((e) => e.code == el.empCode).hours += el.hours;
            }
            this.newHours.find((e) => e.code == el.empCode).week[el.day] +=
              el.hours;
          }
        } else {
          if (!this.isRewradHours(el.empCode)) {
            this.newHours.find((e) => e.type == tempHourType).hours += el.hours;
          }
          this.newHours.find((e) => e.type == tempHourType).week[el.day] =
            el.hours;
          this.newHours.find((e) => e.type == tempHourType).code = el.empCode;
        }
      });
    },
    setExistRewards() {
      var currRewardHours = 0.0;
      var currCode = {};
      Array.from(
        new Set(this.rewardsHours.map((el) => el.employmentCode))
      ).forEach((el) => {
        currRewardHours = this.rewardsHours
          .filter((e) => e.employmentCode == el)
          .reduce((sum, e) => (sum += parseFloat(e.hours)), 0)
          .toFixed(2);
        if (currRewardHours == 0) {
          // do nithing
        } else {
          if (this.newHours.find((e) => e.type == FRONTAL).code == "") {
            this.newHours.find((e) => e.type == FRONTAL).hours +=
              currRewardHours * 1.0; //parse to float
            this.newHours.find((e) => e.type == FRONTAL).code = el;
          } else {
            currCode = this.newHours.find((e) => e.code == el);
            if (!currCode) {
              this.newHours.push({
                code: el,
                hours: currRewardHours,
                type: 1,
                week: [0, 0, 0, 0, 0, 0],
              });
            } else {
              currCode.hours = currRewardHours;
            }
          }
        }
      });
    },
    relevantCodes(row) {
      return this.frontalCodes.filter(
        (el) =>
          !this.newHours.map((e) => e.code).includes(el.code) ||
          el.code == row.code
      );
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
    setBegdaEndda() {
      this.tableBegda = this.FormatDate(this.begda);
      this.tableEndda = this.FormatDate(this.endda);
    },
    FormatDate(iDate) {
      var inputDate = new Date(iDate);
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
    isNumber(n) {
      return !isNaN(parseFloat(n)) && !isNaN(n - 0);
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return 0;
      }
      if (number == 0) {
        return 0;
      }
      return parseFloat(number).toFixed(2);
    },
    currCodeDescription(code) {
      if (code != undefined && code > 0) {
        if (this.codeDescription.find((e) => e.code == code) === undefined) {
          return "";
        }
        return this.codeDescription.find((e) => e.code == code).codeDescription;
      }
      return "";
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
        parseFloat(
          weekArray.reduce((acc, item) => parseFloat(acc) + parseFloat(item), 0)
        ) - row.hours
      );
    },
    leftTableHours() {
      return this.newHours.reduce(
        (acc, item) => parseFloat(acc) + this.leftHours(item),
        0
      );
    },
    hoursAmount() {
      return this.newHours
        .filter((el) => this.isNumber(el.hours))
        .reduce((acc, item) => parseFloat(acc) + parseFloat(item.hours), 0);
    },
    dayAmount(day) {
      return this.newHours.reduce(
        (acc, item) => parseFloat(acc) + parseFloat(item.week[day]),
        0
      );
    },
    cleanWeeklyData() {
      this.newHours.forEach((el) => {
        el.hours = 0;
        el.week = [0, 0, 0, 0, 0, 0];
      });
    },
    setFrontalCodes() {
      this.frontalCodes = this.codeDescription.filter(
        (el) =>
          (el.hourType == FRONTAL || el.hourType == 0) &&
          !this.newHours.find((i) => i.code == el.code)
      );
    },
    isRewradHours(code) {
      return this.isBagrutReward(code) || this.isJobReward(code);
    },
    isBagrutReward(code) {
      if (code == 9671 || code == 2598) {
        return true;
      }
      return false;
    },
    isJobReward(code) {
      let jobRewardType = this.jobRewardTypes.find(
        (el) => el.employmentCode == code
      );
      return jobRewardType == undefined ? false : true;
    },
  },
  mixins: [calcHoursMixin],
};
</script>

<style scoped>
.mySelectOption {
  /* min-width: 200px; */
  max-width: 250px !important;
  max-height: 32px;
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
.disableStyle {
  background-color: #eff0f1;
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
.summaryRow {
  background: #c2c2d6;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
#additionalActions {
  display: flex;
}
#myPlusIcon {
  color: rgb(26, 26, 107);
}
#myMinusIcon {
  color: rgb(190, 30, 30);
}
</style>
