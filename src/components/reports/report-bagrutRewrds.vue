<template>
  <div>
    <v-row id="selections" class="center" style="align-items: initial">
      <v-col cols="12" md="2">
        <v-select
          :items="years"
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
          v-model="selectedMossadId"
          :items="mossadot"
          item-text="mossadName"
          item-value="mossadId"
          label="מוסד"
          placeholder="בחר מוסד"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="1">
        <v-btn color="primary" @click="getRewards()">חפש</v-btn>
      </v-col>
    </v-row>

    <div id="bagrutRewardsReport">
      <v-data-table
        dense
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
            <v-btn color="success" @click="expandExcel()"
              >ייצא אקסל מורחב</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:[`item.percent`]="{ item }"
          >{{ getTwoDigits(item.percent) }}%</template
        >
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import excelMixin from "../../mixins/excelMixin";
export default {
  data() {
    return {
      search: "",
      rewards: [],
      additionalReward: [],
      mossadot: [],
      years: [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ],
      employees: [],
      dataToDisplay: [],
      selectedYear: 0,
      selectedMossadId: 0,
      headers: [
        {
          text: "תעודת זהות",
          value: "empId",
        },
        {
          text: "שם פרטי",
          value: "firstName",
        },
        {
          text: "שם משפחה",
          value: "lastName",
        },
        {
          text: "גמול שעות",
          value: "hours",
        },
        {
          text: "גמול אחוזים",
          value: "percent",
        },
      ],
      classes: [
        { text: "ט", value: 9 },
        { text: "י", value: 10 },
        { text: 'י"א', value: 11 },
        { text: 'י"ב', value: 12 },
      ],
      isExternalRange: [
        {
          text: "חצוני",
          value: true,
        },
        {
          text: "פנימי",
          value: false,
        },
      ],
      isSplitedRange: [
        {
          text: "לא",
          value: false,
        },
        {
          text: "כן",
          value: true,
        },
      ],
    };
  },
  async mounted() {
    this.initilize();
    await this.getEmployees();
    await this.getMossadot();
    await this.getBagrutRewards();
    await this.getRewards();
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
      if (this.$store.state.logginAs == this.$store.state.logginAs) {
        this.selectedMossadId = this.$store.state.logginAs;
      }
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
    async getRewards() {
      this.rewards = [];
      await axios
        .get("/teachersRewards/byMossadAndYear", {
          params: {
            mossadId: this.selectedMossadId,
            year: this.selectedYear,
            rewardType:1
          },
        })
        .then((response) => {
          this.rewards = response.data;
          this.setDataToDisplay();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
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
    async getBagrutRewards() {
      await axios
        .get("bagrutRewards/all")
        .then((response) => {
          this.additionalReward = response.data;
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    setDataToDisplay() {
      this.dataToDisplay = [];
      var existEmployees = Array.from(
        new Set(this.rewards.map((el) => el.empId))
      );
      for (let index = 0; index < existEmployees.length; index++) {
        const currEmpId = existEmployees[index];
        const empData = this.employees.find((el) => el.empId == currEmpId);
        this.dataToDisplay.push({
          empId: currEmpId,
          firstName: empData.firstName,
          lastName: empData.lastName,
          hours: this.rewards
            .filter((el) => el.empId == currEmpId)
            .reduce((sum, e) => (sum += parseFloat(e.hours)), 0),
          percent: this.rewards
            .filter((el) => el.empId == currEmpId)
            .reduce((sum, e) => (sum += parseFloat(e.percent)), 0),
        });
      }
    },
    exportDataToExcel() {
      var dataToExport = [];
      var excelHeaders = {
        year: "שנה",
        empId: "תעודת זהות",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        hours: "גמול שעות",
        percent: "גמול אחוזים",
      };
      this.dataToDisplay.forEach((el) => {
        dataToExport.push({
          year: this.selectedYear,
          empId: el.empId,
          firstName: el.firstName,
          lastName: el.lastName,
          hours: el.hours,
          percent: el.percent,
        });
      });
      this.downloadFile(
        dataToExport,
        excelHeaders,
        "דוח שעות.xlsx",
        "סיכום שעות"
      );
    },
    onRowClicked(row) {
      this.$store.dispatch("setEmpId", row.empId);
      this.$store.dispatch("setLoggedAs", this.selectedMossadId);
      let routeData = this.$router.resolve({ name: "AdditionalRewards" });
      window.open(routeData.href);
    },
    onYearChange() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
      this.getRewards();
    },
    expandExcel() {
      var excelHeaders = {
        empId: "תעודת זהות",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        // mossadId: "מוסד",
        mossadName: "שם מוסד",
        year: "שנה",
        studyName: "מקצוע",
        questionnaire: "שאלון",
        studyUnits: 'יח"ל',
        teachingClass: "כיתה",
        external: "סוג",
        split: "מפוצל",
        students: "תלמידים",
        hoursReward: "גמול שעות",
        percentReward: "גמול אחוזים",
      };
      var excelData = [];
      var currReward = {};

      this.rewards.forEach((el) => {
        currReward = this.additionalReward.find(
          (e) => e.recordkey == el.rewardId
        );

        excelData.push({
          empId: el.empId,
          firstName: this.employees.find((e) => e.empId == el.empId).firstName,
          lastName: this.employees.find((e) => e.empId == el.empId).lastName,
          mossadName: this.$store.state.mossadInfo.mossadName,
          year: this.selectedYear,
          studyName: currReward.studyName,
          questionnaire: currReward.questionnaire,
          studyUnits: currReward.studyUnits,
          external: this.isExternalRange.find((e) => e.value == el.external)
            .text,
          teachingClass: this.classes.find((e) => e.value == el.teachingClass)
            .text,
          split: this.isSplitedRange.find((e) => e.value == el.split).text,
          students: el.students,
          hoursReward: el.hours,
          percentReward: el.percent,
        });
      });
      excelData.sort((a, b) => (a.empId > b.empId ? 1 : -1));
      this.downloadFile(
        excelData,
        excelHeaders,
        "גמולי בגרות.xlsx",
        "גמולי בגרות"
      );
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return 0.0;
      }
      return parseFloat(number).toFixed(2);
    },
  },
  mixins: [excelMixin],
};
</script>

<style scoped>
#bagrutRewardsReport {
  max-width: 70%;
  margin: auto;
}
</style>