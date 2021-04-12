<template>
  <div>
    <v-row id="selections" class="center" style="align-items: initial">
      <v-col cols="12" md="2">
        <v-select
          :items="$store.state.years"
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
          @change="getGaps()"
        ></v-autocomplete>
      </v-col>
      <!-- <v-col cols="12" md="2">
        <v-select
          class="myMaxWindth"
          v-model="selectedReformType"
          :items="reformTable"
          hide-selected
          label="רפורמה"
          placeholder="בחר"
          @change="getGaps()"
        ></v-select>
      </v-col> -->
      <v-col cols="12" md="1">
        <v-btn color="primary" @click="getGaps()">חפש</v-btn>
      </v-col>
    </v-row>
    <v-data-table
      dense
      fixed-header
      height="500"
      :headers="headers"
      :items="tableToDisplay"
      :search="search"
      @click:row="onRowClicked"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      no-data-text="לא נמצאו נתונים עבור החיפוש המבוקש"
      class="elevation-1 center"
      id="gapsTable"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-card-title>
              <v-row>
                <v-col cols="12" md="8">
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
                <v-col cols="12" md="4">
                  <v-btn @click="handleFilterGaps()">{{ buttomText() }}</v-btn>
                </v-col>
              </v-row>
            </v-card-title>
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:[`item.hours`]="{ item }">{{
        getTwoDigits(item.hours)
      }}</template>
      <template v-slot:[`item.actualHours`]="{ item }">{{
        getTwoDigits(item.actualHours)
      }}</template>
      <template v-slot:[`item.gaps`]="{ item }">{{
        getTwoDigits(item.hours - item.actualHours)
      }}</template>
      <template v-slot:[`item.rewardType`]="{ item }">{{
        getRewardType(item.rewardType)
      }}</template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      gapsTable: [],
      tableToDisplay: [],
      onlyGaps: false,
      search: "",
      headers: [
        {
          text: "תז",
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
          text: "שעות",
          value: "hours",
        },
        {
          text: "שעות מנוצלות",
          value: "actualHours",
        },
        {
          text: "הפרש",
          value: "gaps",
        },
        {
          text: "סוג גמול",
          value: "rewardType",
        },
      ],
      mossadot: [],
      tableData: [],
      reformTable: [
        { text: "עוז לתמורה", value: 5 },
        { text: "עולם ישן", value: 2 },
      ],
      selectedYear: 0,
      selectedMossadId: 0,
      selectedReformType: 5,
    };
  },
  async created() {
    this.initilize();
    await this.getGaps();
    await this.getMossadot();
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
    async getGaps() {
      await axios
        .get("teachersRewards/findGaps", {
          params: {
            year: this.selectedYear,
            mossadId: this.selectedMossadId,
          },
        })
        .then((response) => {
          this.tableData = response.data;
          this.tableToDisplay = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
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
    onYearChange() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
      this.getGaps();
    },
    buttomText() {
      return !this.onlyGaps ? "רק חריגות" : "הצג הכל";
    },
    onRowClicked(row) {
      this.$store.dispatch("setEmpId", row.empId);
      this.$store.dispatch("setLoggedAs", this.selectedMossadId);
      let routeData = this.$router.resolve({ name: "employeeInfo" });
      window.open(routeData.href);
    },
    getPsitiveNumber(val) {
      if (val < 0) {
        return val * -1;
      }
    },
    getTwoDigits(number) {
      if (isNaN(number) || number == null) {
        return 0.0;
      }
      return parseFloat(number).toFixed(2);
    },
    getRewardType(type) {
      if (type == 1) {
        return " בגרות";
      } else {
        return " תפקיד";
      }
    },
    handleFilterGaps() {
      this.onlyGaps = !this.onlyGaps;
      if (this.onlyGaps) {
        this.tableToDisplay = this.tableToDisplay.filter(
          (el) =>
            this.getTwoDigits(el.hours) != this.getTwoDigits(el.actualHours)
        );
      } else {
        this.tableToDisplay = this.tableData;
      }
    },
  },
};
</script>

<style scoped>
#gapsTable {
  width: 50%;
  margin-top: 50px;
}
</style>