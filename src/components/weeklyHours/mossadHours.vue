<template>
  <div>
    <v-row id="mossadHoursDetails">
      <v-col cols="12" md="2" sm="2">
        <v-select
          style="max-hight: 40px"
          :items="$store.state.years"
          @change="onYearChanged()"
          v-model="selectedYear"
          item-text="hebrewYear"
          item-value="year"
          label="שנה"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <p>מוסד - {{ mossadInfo.mossadName }}</p>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <a @click="navToReport()">שעות מאוישות - {{ mossadInfo.currHours }}</a>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <p>
          יתרת שעות -
          {{ getTwoDigits(mossadInfo.maxHours - mossadInfo.currHours) }}
        </p>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <p>מגבלת שעות- {{ mossadInfo.maxHours }}</p>
      </v-col>
      <v-col cols="12" md="2" sm="2">
        <p>
          אחוז איוש -
          {{
            getTwoDigits((mossadInfo.currHours / mossadInfo.maxHours) * 100)
          }}%
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { bus } from "../../main";
export default {
  props: ["mossadInfo"],
  data() {
    return {
      selectedYear: "",
    };
  },
  created() {
    this.initilize();
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
    },
    onYearChanged() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
      bus.$emit("yearChanged");
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    navToReport() {
      let routeData = this.$router.resolve({
        path: "/report/reportWeeklyHours",
      });
      window.open(routeData.href);
    },
  },
};
</script>

<style scoped>
p {
  font-weight: bold;
}
</style>