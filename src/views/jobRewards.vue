<template>
  <div id="jobRewardsContainer">
    <div style="display: inline-flex">
      <v-select
        style="max-hight: 40px; width: 20%"
        :items="$store.state.years"
        v-model="selectedYear"
        item-text="hebrewYear"
        item-value="year"
        label="שנה"
        @change="onYearChanged()"
      ></v-select>
      <div class="navToReport" @click="navToReport()">
        <p>מוסד - {{ _mossadInfo.mossadName }}</p>
        <p>סך גמול שעות:{{ getTwoDigits(_mossadInfo.hoursReward) }}</p>
        <p>סך גמולים אחוזיים:{{ getTwoDigits(_mossadInfo.percentReward) }}%</p>
      </div>
    </div>
    <v-row>
      <v-col id="serchEmployee" cols="12" md="2" lg="3">
        <v-autocomplete
          v-model="empId"
          :items="tzArray"
          hide-selected
          :item-text="
            (item) => item.firstName + ' ' + item.lastName + ' - ' + item.empId
          "
          item-value="empId"
          label="תעודת זהות"
          placeholder="חפש"
          @change="onEmpIdChange()"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <jobReward
      v-if="empId != null && additionalReward.length > 0"
      :key="compKey"
      :empId="empId"
      :empData="empData"
      :selectedYear="selectedYear"
      :additionalReward="additionalReward"
      :existData="existData"
    />
  </div>
</template>
<script>
import axios from "axios";
import { bus } from "../main";
import jobReward from "../components/additionalReward/jobReward";
export default {
  name: "AdditionalRewards",
  components: {
    jobReward,
  },
  data() {
    return {
      mossadInfo: { mossadName: "", percentReward: 0, hoursReward: 0 },
      empData: {},
      selectedYear: 0,
      tzArray: [],
      existData: [],
      empId: null,
      compKey: 0,
      additionalReward: [],
    };
  },
  async mounted() {
    this.initilize();
    if (this.empId != null) {
      await this.getExistData();
    }
    await this.getAdditionalRewards();
    await this.getAllTz();
    this.getMossadSum();
    bus.$on("reloadJobDataPerMossad", async () => {
      this.getMossadSum();
      this.getExistData();
    });
  },
  computed: {
    _hoursSum() {
      return this.existData.reduce((sum, e) => (sum += parseFloat(e.hours)), 0);
    },
    _percentSum() {
      return this.existData
        .reduce((sum, e) => (sum += parseFloat(e.percent)), 0)
        .toFixed(2);
    },
    _mossadInfo() {
      return this.mossadInfo;
    },
  },
  methods: {
    initilize() {
      this.mossadInfo.mossadName = this.$store.state.mossadInfo.mossadName;
      if (this.$store.state.selectedYear != 0) {
        this.selectedYear = this.$store.state.selectedYear;
      } else {
        let currDate = new Date();
        this.selectedYear =
          currDate.getMonth() >= 8
            ? currDate.getFullYear() + 1
            : currDate.getFullYear();
      }
      if (this.$store.state.empId != null) {
        this.empId = this.$store.state.empId;
      }
    },
    async getAdditionalRewards() {
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
    async getAllTz() {
      axios
        .get("/employees/all")
        .then((response) => {
          this.tzArray = response.data;
          this.empData = this.tzArray.find((el) => el.empId == this.empId);
          if (this.$store.state.empId != null) {
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
    async getExistData() {
      await axios
        .get("/teachersRewards/byEmpIdAndMossadAndYearAndType", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
            rewardType: 2,
          },
        })
        .then((response) => {
          this.existData = response.data;
          this.compKey += 1;
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    async getMossadSum() {
      var temp = [];
      await axios
        .get("/teachersRewards/byMossadAndYearAndType", {
          params: {
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
            rewardType: 2,
          },
        })
        .then((response) => {
          temp = response.data;
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });

      this.mossadInfo.hoursReward = temp.reduce(
        (sum, e) => (sum += parseFloat(e.hours)),
        0
      );
      this.mossadInfo.percentReward = temp
        .reduce((sum, e) => (sum += parseFloat(e.percent)), 0)
        .toFixed(2);
    },
    navToReport() {
      let routeData = this.$router.resolve({
        path: "/report/reportJobRewards",
      });
      window.open(routeData.href);
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    onYearChanged() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
      this.getExistData();
    },
    async onEmpIdChange() {
      this.$store.dispatch("setEmpId", this.empId);
      await this.getExistData();
      this.empData = this.tzArray.find((el) => el.empId == this.empId);
    },
  },
};
</script>

<style scoped>
#jobRewardsContainer {
  margin-bottom: 10%;
  margin-left: 5%;
  margin-right: 5%;
  padding: 15px;
}
#mossadHoursDetails:hover {
  cursor: pointer;
}
.v-icon.v-icon {
  max-width: 10px;
  max-height: 10px;
  margin-top: 60%;
  margin-right: 10px;
  color: blue;
}
p {
  font-weight: bold;
}
.text-xs-right {
  white-space: nowrap;
  /* To help visualize the fact that the container is too small */
  width: 10px;
  /* border: 1px solid #ddd; */
}
.navToReport > * {
  display: inline-flex;
  cursor: pointer;
  margin-right: 40px;
}
</style>