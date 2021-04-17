<template>
  <v-card>
    <div class="littleMargin">
      <mossadHours :mossadInfo="mossadInfo" />
      <div v-show="mossadInfo.maxHours != null && mossadInfo.maxHours != 0">
        <div class="flexEmployeeHours">
          <v-autocomplete
            :disabled="mossadInfo.maxHours == null || mossadInfo.maxHours == 0"
            v-model="empId"
            :items="tzArray"
            :item-text="
              (item) =>
                item.firstName + ' ' + item.lastName + ' - ' + item.empId
            "
            item-value="empId"
            label="תעודת זהות"
            placeholder="חפש"
            hide-selected
            class="autoCompleteEmployees"
            @change="getEmployeeInfo()"
          ></v-autocomplete>
          <div>
            <employeeHours
              :employeeInfo="employeeInfo"
              :empHoursTable="empHoursTable"
              :estimateJobPercent="estimateJobPercent"
              :workInReforms="workInReforms"
              :datesRange="datesRange"
              :reformTypes="reformTypes"
            />
          </div>
        </div>
        <v-row v-if="empId != null">
          <v-col cols="12" md="3" sm="3">
            <v-select
              v-model="selectedReforms"
              :items="filterReformTypeByMossad()"
              item-text="name"
              item-value="reformId"
              label="בחר רפורמה"
              multiple
              single-line
              class="autoCompleteEmployees"
            ></v-select>
          </v-col>
        </v-row>
        <div v-if="employeeInfo != null && selectedReforms != null">
          <v-card
            v-for="(reform, index) in selectedReforms"
            :key="index"
            class="littleSpace center"
          >
            <v-progress-circular
              :size="100"
              color="primary"
              indeterminate
              v-show="circleProgress"
            ></v-progress-circular>
            <weeklyHours
              v-show="!circleProgress"
              :key="compId"
              :empId="empId"
              :selectedYear="selectedYear"
              :reformType="reform"
              :isMother="employeeInfo.mother"
              :ageHours="ageHours"
              :codeDescription="getRelevantCodesDescription(reform)"
              :jobRewardTypes="jobRewardTypes"
              :rewardsHours="getRelevantRewardHours(reform)"
              :existData="getRelevantData(reform)"
              :existTeacherHours="getRelevantTeacherHours(existTeacherHours)"
            ></weeklyHours>
          </v-card>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
import mossadHours from "./mossadHours";
import weeklyHours from "./weekly-hours.vue";
import employeeHours from "./employeeHoursInfo.vue";
import calcHoursMixin from "../../mixins/calcHoursMixin";
import { bus } from "../../main";

export default {
  name: "setEmployeesHours",
  components: {
    weeklyHours,
    mossadHours,
    employeeHours,
  },
  data() {
    return {
      selectedReforms: [],
      selectedYear: 0,
      empId: null,
      ageHours: 0,
      tzArray: [],
      datesRange: { min: "", max: "" },
      employeeInfo: {},
      existData: [],
      existTeacherHours: [],
      reformTypes: [],
      workInReforms: [],
      codeDescription: [],
      empHoursTable: [],
      jobRewardTypes: [],
      mossadot: [],
      rewardsHours: [],
      mossadInfo: { mossadId: "", mossadName: "", maxHours: 0, currHours: 0 },
      hoverText: "",
      compId: 0,
      estimateJobPercent: 0,
      circleProgress: false,
    };
  },
  created() {
    this.initilize();
    this.getAllTz();
    this.getCodeDescription();
    this.getReformTypes();
    this.getMossadHours();
    this.getBagrutRewardsTypes();
  },
  mounted() {
    if (this.empId != null) {
      this.getEmployeeInfo();
    }
    bus.$on("changeWeeklyHours", async () => {
      this.getAllEmpData();
      this.getMossadHours();
    });
    bus.$on("yearChanged", async () => {
      this.onYearChanged();
    });
  },
  methods: {
    initilize() {
      if (this.$store.state.selectedYear != 0) {
        this.selectedYear = this.$store.state.selectedYear;
      } else {
        let currDate = new Date();
        this.selectedYear =
          currDate.getMonth() >= 8
            ? currDate.getFullYear() + 1
            : currDate.getFullYear();
      }
      if (this.$store.state.empId != 0) {
        this.empId = this.$store.state.empId;
      }
      this.mossadInfo.mossadId = this.$store.state.mossadId;
      this.mossadInfo.mossadName = this.$store.state.mossadInfo.mossadName;
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
      this.setBegdaEndda();
      this.compId = 0;
    },
    onYearChanged() {
      this.selectedYear = this.$store.state.selectedYear;
      this.getEmployeeInfo();
      this.setBegdaEndda();
      this.getMossadHours();
    },
    getAllTz() {
      axios
        .get("/employees/all")
        .then((response) => {
          this.tzArray = response.data;
          if (this.$store.state.empId != 0) {
            this.empId = this.tzArray.find(
              (el) => el.empId == this.$store.state.empId
            ).empId;
          }
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    async getEmployeeInfo() {
      this.circleProgress = true;
      this.$store.dispatch("setEmpId", this.empId);
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
      await this.getAllEmpData();
      setTimeout(() => (this.circleProgress = false), 1000);
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
          // eslint-disable-next-line no-debugger
          debugger;
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
    async getAllEmpData() {
      if (this.empId == null || this.empId == "") {
        return;
      }
      //TODO : promises list wait for all
      await axios
        .get("/teacherHours/byEmpIdAndMossadId", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAs,
            begda: this.datesRange.min,
            endda: this.datesRange.max,
          },
        })
        .then((response) => {
          this.existTeacherHours = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );

      await axios
        .get("/teacherEmploymentDetails/byId", {
          params: {
            empId: this.empId,
            begda: this.datesRange.min,
            endda: this.datesRange.max,
          },
        })
        .then((response) => {
          this.existData = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
      await axios
        .get("/teachersRewards/byEmpIdAndMossadAndYear", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
          },
        })
        .then((response) => {
          this.rewardsHours = response.data;
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      this.calcEmpHoursData();
      this.getEstimateJobPercent();
      this.compId += 1;
    },
    getBagrutRewardsTypes() {
      axios
        .get("jobRewards/all")
        .then((response) => {
          this.jobRewardTypes = response.data;
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    getEstimateJobPercent() {
      axios
        .get("/jobPercent/byId", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
          },
        })
        .then((response) => {
          response.data;
          if (!response.data) {
            this.estimateJobPercent = 0;
          } else {
            this.estimateJobPercent = response.data.estimateJobPercent;
          }
          // if (this.estimateJobPercent < this.empHoursTable[1].jobPercent) {
          //   alert("יש לעדכן הסכם העסקה לשעות זמניות");
          // }
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
    filterReformTypeByMossad() {
      if (this.$store.state.mossadInfo.mossadType == 2) {
        return this.reformTypes.filter(
          (el) =>
            el.reformId == 1 ||
            el.reformId == 5 ||
            el.reformId == 7 ||
            el.reformId == 2 ||
            el.reformId == 8
        );
      } else if (this.$store.state.mossadInfo.mossadType == 1) {
        return this.reformTypes.filter(
          (el) => el.reformId == 1 || el.reformId == 5 || el.reformId == 8
        );
      }
      return this.reformTypes;
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
    getRelevantTeacherHours(reformType) {
      return this.existTeacherHours.filter(
        (el) =>
          el.reformType == reformType &&
          el.mossadId == this.$store.state.logginAs
      );
    },
    getRelevantRewardHours(reform) {
      return this.rewardsHours.filter((el) => el.reformId == reform);
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
    calcEmpHoursData() {
      // this function calc all emp hours the
      this.workInReforms = [];

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

        // add current reforms so it will open automaticly
        if (
          !this.workInReforms.includes(el.reformType) &&
          el.mossadId == this.$store.state.logginAs &&
          el.hours != 0
        ) {
          this.workInReforms.push(el.reformType);
        }
      });
      this.empHoursTable[0].sum = this.empHoursTable[0].sum.toFixed(2);
      this.empHoursTable[1].sum = this.empHoursTable[1].sum.toFixed(2);
      // Add rewards to existing reforms work in
      this.rewardsHours.forEach((el) => {
        if (!this.workInReforms.includes(el.reformId) && el.hours != 0) {
          this.workInReforms.push(el.reformId);
        }
      });
      this.selectedReforms = this.workInReforms;

      // calc job percent devied by curr mossad and all mossadot
      this.reformTypes.forEach((el) => {
        let currReformPerMossadSum = this.existData
          .filter(
            (e) =>
              e.reformType == el.reformId &&
              e.mossadId == this.$store.state.logginAs
          )
          .reduce((sum, e) => (sum += parseFloat(e.hours)), 0)
          .toFixed(2);
        this.empHoursTable[0].jobPercent += this.calcJobPercent(
          el.reformId,
          currReformPerMossadSum,
          this.ageHours,
          this.employeeInfo.mother
        );
        let currReformSum = this.existData
          .filter((e) => e.reformType == el.reformId)
          .reduce((sum, e) => (sum += parseFloat(e.hours)), 0)
          .toFixed(2);
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
  mixins: [calcHoursMixin],
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
.littleSpace {
  margin: 10px;
  padding: 10px;
}
.autoCompleteEmployees {
  width: 400px;
  margin-left: 0.7rem;
}
.flexEmployeeHours {
  display: flex;
}
</style>
