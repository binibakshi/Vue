<template>
  <div class="wrapper">
    <v-row>
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
      <v-col cols="12" md="8">
        <v-data-table
          height="450"
          :headers="headers"
          :items="tableToDisplay"
          :search="search"
          dense
          :footer-props="{
            'items-per-page-options': [20, 50, 100, -1],
            'items-per-page-text': 'מספר תוצאות  :',
          }"
          class="elevation-3 jobPercentTable"
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
            </v-toolbar>
          </template>
          <template v-slot:[`item.jobPercent`]="{ item }">
            <v-text-field
              dense
              style="max-width: 150px"
              v-model="item.jobPercent"
            />
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <!-- <v-icon small @click="saveJobPercent(item)">mdi-content-save</v-icon> -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  class="mr-2"
                  @click="saveJobPercent(item)"
                  v-bind="attrs"
                  v-on="on"
                  >mdi-content-save</v-icon
                >
              </template>
              <span>שמור</span>
            </v-tooltip>
          </template>
        </v-data-table></v-col
      >
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      search: "",
      selectedYear: 0,
      selectedMossadId: 0,
      tzArray: [],
      jobPercent: [],
      tableToDisplay: [],
      headers: [
        { text: "תעודת זהות", value: "empId" },
        { text: "שם משפחה", value: "lastName" },
        { text: "שם פרטי", value: "firstName" },
        { text: "קביעות משרה", value: "jobPercent" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
      years: [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ],
    };
  },
  async created() {
    this.initilize();
    await this.getAllJobPercent();
    await this.getAllTz();
    this.setExistData();
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
    async getAllJobPercent() {
      await axios
        .get("/jobPercent/byYearAndMossad", {
          params: {
            mossadId: this.selectedMossadId,
            year: this.selectedYear,
          },
        })
        .then((response) => {
          this.jobPercent = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    saveJobPercent(row) {
      let dataToSAve = {
        empId: row.empId,
        mossadId: this.selectedMossadId,
        year: this.selectedYear,
        jobPercent: row.jobPercent,
      };
      axios({
        url: "/jobPercent/save",
        method: "post",
        data: dataToSAve,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    setExistData() {
      let currEmp = {};
      let JobPercentage = 0;
      this.tzArray.forEach((el) => {
        currEmp = this.jobPercent.find((e) => e.empId == el.empId);
        if (!currEmp) {
          JobPercentage = 0;
        } else {
          JobPercentage = currEmp.jobPercent;
        }
        this.tableToDisplay.push({
          empId: el.empId,
          firstName: el.firstName,
          lastName: el.lastName,
          jobPercent: JobPercentage,
        });
      });
    },
    onYearChange() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
      this.getRewards();
    },
  },
};
</script>

<style scoped>
.wrapper {
  padding: 3%;
}
input {
  border: 1px solid;
}
.header {
  justify-content: center;
  font-weight: bold;
  text-decoration: underline;
}

#searchEmployee {
  max-width: 400px;
}
.jobPercentTable {
}
#myform {
  background-color: #ffffe6;
}
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  background-color: initial;
}
</style>