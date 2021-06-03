<template>
  <div>
    <div class="jobRewardsReport">
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
  props: ["selectedYear", "selectedMossadId"],
  data() {
    return {
      search: "",
      rewards: [],
      additionalReward: [],
      employees: [],
      dataToDisplay: [],
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
    await this.getEmployees();
    await this.getJobRewards();
    await this.getRewards();
  },
  methods: {
    async getRewards() {
      this.rewards = [];
      await axios
        .get("/teachersRewards/byMossadAndYearAndType", {
          params: {
            mossadId: this.selectedMossadId,
            year: this.selectedYear,
            rewardType: 2,
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
    async getJobRewards() {
      await axios
        .get("jobRewards/all")
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
            .reduce((sum, e) => (sum += parseFloat(e.hours)), 0)
            .toFixed(2),
          percent: this.rewards
            .filter((el) => el.empId == currEmpId)
            .reduce((sum, e) => (sum += parseFloat(e.percent)), 0)
            .toFixed(2),
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
      let routeData = this.$router.resolve({ name: "jobRewards" });
      window.open(routeData.href);
    },
    expandExcel() {
      var excelHeaders = {
        empId: "תעודת זהות",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        mossadName: "שם מוסד",
        year: "שנה",
        employmentCode: "קוד מקצוע",
        codeDescription: "תיאור גמול",
        hoursReward: 'ס"ה שעות',
        percentReward: 'ס"ה אחוזים',
        hoursNormal: "גמול שעות",
        hoursOTS: "שעות תוספתיות",
        percentNormal: "גמול אחוזים",
        percentOTS: "אחוזים תוספתיים",
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
          employmentCode: currReward.employmentCode,
          codeDescription: currReward.description,
          hoursReward: el.hours,
          percentReward: el.percent,
          hoursNormal: el.hoursNormal,
          hoursOTS: el.hoursOTS,
          percentNormal: el.percentNormal,
          percentOTS: el.percentOTS,
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
.jobRewardsReport {
  max-width: 70%;
  margin: auto;
}
</style>