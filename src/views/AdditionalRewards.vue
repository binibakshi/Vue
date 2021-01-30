<template>
  <v-container grid-list-xs>
    <v-row id="mossadHoursDetails">
      <v-col cols="12" md="2">
        <v-select
          style="max-hight: 40px"
          :items="years"
          v-model="selectedYear"
          item-text="hebrewYear"
          item-value="year"
          label="שנה"
          @change="onYearChanged()"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <p>מוסד - {{ _mossadInfo.mossadName }}</p>
      </v-col>
      <v-col cols="12" md="3">
        <p>סך גמול שעות:{{ _mossadInfo.hoursReward }}</p>
      </v-col>
      <v-col cols="12" md="3">
        <p>סך גמולים אחוזיים:{{ getTwoDigits(_mossadInfo.percentReward) }}%</p>
      </v-col>
    </v-row>
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

      <!-- <v-col cols="12" md="2">
        <p>סך גמול שעות:{{ _hoursSum }}</p>
      </v-col>
      <v-col cols="12" md="2">
        <p>סך גמולים אחוזיים:{{ getTwoDigits(_percentSum) }}%</p>
      </v-col> -->
    </v-row>
    <bagrutReward
      v-if="empId != null && additionalReward.length > 0"
      :empId="empId"
      :empData="empData"
      :selectedYear="selectedYear"
      :additionalReward="additionalReward"
      :existData="existData"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import bagrutReward from "../components/additionalReward/bagrutReward";
export default {
  name: "AdditionalRewards",
  components: {
    bagrutReward,
  },
  data() {
    return {
      mossadInfo: {},
      empData: {},
      selectedYear: 0,
      tzArray: [],
      existData: [],
      empId: null,
      additionalReward: [],
      years: [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ],
    };
  },
  async mounted() {
    await this.initilize();
    await this.getAdditionalRewards();
    await this.getAllTz();
    if (this.empId != null) {
      this.getExistData();
    }
    this.getMossadSum();
  },
  computed: {
    _hoursSum() {
      return this.existData.reduce((sum, e) => (sum += parseFloat(e.hours)), 0);
    },
    _percentSum() {
      return this.existData.reduce(
        (sum, e) => (sum += parseFloat(e.percent)),
        0
      );
    },
    _mossadInfo() {
      return this.mossadInfo;
    },
  },
  methods: {
    initilize() {
      this.mossadInfo = this.$store.state.mossadInfo;
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
    async getAllTz() {
      axios
        .get("/employees/all")
        .then((response) => {
          this.tzArray = response.data;
          this.empData = this.tzArray.find((el) => el.empId == this.empId);
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getExistData() {
      axios
        .get("/teachersRewards/byEmpIdAndMossadAndYear", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
          },
        })
        .then((response) => {
          this.existData = response.data;
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
        .get("/teachersRewards/byMossadAndYear", {
          params: {
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
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
      this.mossadInfo.percentReward = temp.reduce(
        (sum, e) => (sum += parseFloat(e.percent)),
        0
      );
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    onYearChanged() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
    },
    onEmpIdChange() {
      this.$store.dispatch("setEmpId", this.empId);
      this.getExistData();
      this.empData = this.tzArray.find((el) => el.empId == this.empId);
    },
  },
};
</script>

<style scoped>
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
</style>