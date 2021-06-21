<template>
  <div>
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
      class="elevation-1 center gapsTable"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-card-title>
              <v-row>
                <v-col cols="12" md="4">
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
                <v-col cols="12" md="8"
                  ><v-btn @click="handleFilterGaps('All')">הצג הכל</v-btn>
                  <v-btn @click="handleFilterGaps('GapsOnly')">רק חריגות</v-btn>
                  <v-btn @click="handleFilterGaps('ZerosOnly')"
                    >לא מאוייש</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-title>
          </v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:[`item.jobPercent`]="{ item }"
        >{{ getTwoDigits(item.jobPercent) }}%</template
      >
      <template v-slot:[`item.estimateJobPercent`]="{ item }"
        >{{ getTwoDigits(item.estimateJobPercent) }}%</template
      >
      <template v-slot:[`item.gaps`]="{ item }"
        >{{ getTwoDigits(item.gaps) }}%</template
      >
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "reportJobPercentGaps",
  props: ["selectedYear", "selectedMossadId"],
  data() {
    return {
      gapsTable: [],
      tableToDisplay: [],
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
          text: "קביעות משרה",
          value: "estimateJobPercent",
        },
        {
          text: "אחוזים בפועל",
          value: "jobPercent",
        },
        {
          text: "הפרש",
          value: "gaps",
        },
      ],
      tzArray: [],
      jobPercentTable: [],
      reformTable: [
        { text: "עוז לתמורה", value: 5 },
        { text: "עולם ישן", value: 2 },
      ],
      selectedReformType: 5,
    };
  },
  async created() {
    await this.getAllTz();
    await this.getGaps();
    this.setExistData();
  },
  methods: {
    async getGaps() {
      this.jobPercentTable = [];
      await axios
        .get("jobPercent/byYearAndMossad", {
          params: {
            year: this.selectedYear,
            mossadId: this.selectedMossadId,
          },
        })
        .then((response) => {
          this.jobPercentTable = response.data;
          this.setExistData();
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    async getAllTz() {
      await axios
        .get("/employees/all")
        .then((response) => {
          this.tzArray = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    setExistData() {
      let currEmp = {};
      this.tableToDisplay = [];
      this.jobPercentTable.forEach((el) => {
        currEmp = this.tzArray.find((e) => e.empId == el.empId);
        this.tableToDisplay.push({
          empId: currEmp.empId,
          firstName: currEmp.firstName,
          lastName: currEmp.lastName,
          estimateJobPercent: el.estimateJobPercent,
          jobPercent: el.jobPercent,
          gaps: el.estimateJobPercent - el.jobPercent,
        });
      });
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
    handleFilterGaps(filter) {
      this.setExistData();
      if (filter == "GapsOnly") {
        this.tableToDisplay = this.tableToDisplay.filter(
          (el) =>
            this.getTwoDigits(el.jobPercent) !=
            this.getTwoDigits(el.estimateJobPercent)
        );
      } else if (filter == "ZerosOnly") {
        this.tableToDisplay = this.tableToDisplay.filter(
          (el) => el.jobPercent == 0
        );
      }
    },
  },
};
</script>

<style scoped>
.gapsTable {
  width: 70%;
  margin-top: 50px;
}
</style>