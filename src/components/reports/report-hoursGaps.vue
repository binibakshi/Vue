<template>
  <div>
    <div class="center">
      <v-progress-circular
        :size="200"
        color="primary"
        indeterminate
        v-show="circleProgress"
      ></v-progress-circular>
    </div>
    <div v-show="!circleProgress">
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
                    <v-btn @click="handleFilterGaps()">{{
                      buttomText()
                    }}</v-btn>
                  </v-col>
                </v-row>
              </v-card-title>
            </v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:[`item.estimateHours`]="{ item }">{{
          getTwoDigits(item.estimateHours)
        }}</template>
        <template v-slot:[`item.actualHours`]="{ item }">{{
          getTwoDigits(item.actualHours)
        }}</template>
        <template v-slot:[`item.gaps`]="{ item }">{{
          getTwoDigits(item.estimateHours - item.actualHours)
        }}</template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  
  props:["selectedYear","selectedMossadId"],
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
          value: "estimateHours",
        },
        {
          text: "שעות מנוצלות",
          value: "actualHours",
        },
        {
          text: "הפרש",
          value: "gaps",
        },
      ],
      tableData: [],
      reformTable: [
        { text: "עוז לתמורה", value: 5 },
        { text: "עולם ישן", value: 2 },
      ],
      circleProgress: false,
    };
  },
  async created() {
    await this.getGaps();
  },
  methods: {
    async getGaps() {
      this.circleProgress = true;
      await axios
        .get("teacherHours/findGaps", {
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
      this.circleProgress = false;
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
    getTwoDigits(number) {
      if (isNaN(number) || number == null) {
        return 0.0;
      }
      return parseFloat(number).toFixed(2);
    },
    handleFilterGaps() {
      this.onlyGaps = !this.onlyGaps;
      if (this.onlyGaps) {
        this.tableToDisplay = this.tableToDisplay.filter(
          (el) =>
            this.getTwoDigits(el.estimateHours) !=
            this.getTwoDigits(el.actualHours)
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