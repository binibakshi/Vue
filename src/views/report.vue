<template>
  <div>
    <v-row
      v-show="showDefalutHeader"
      id="selections"
      class="center"
      style="align-items: initial"
    >
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
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="1">
        <v-btn color="primary" @click="compId++">חפש</v-btn>
      </v-col>
    </v-row>
    <component
      :key="compId"
      v-bind:is="comp"
      :selectedYear="selectedYear"
      :selectedMossadId="selectedMossadId"
    ></component>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "report",
  data() {
    return {
      components: [
        {
          name: "reportBagrutRewards",
          location: "report-bagrutRewrds.vue",
          defaultHeader: true,
        },
        {
          name: "reportJobRewards",
          location: "report-jobRewards.vue",
          defaultHeader: true,
        },
        {
          name: "reportWeeklyHours",
          location: "report-weeklyHours.vue",
          defaultHeader: false,
        },
        {
          name: "reportRewardGaps",
          location: "report-rewardHoursGaps.vue",
          defaultHeader: true,
        },
        {
          name: "reportJobPercentGaps",
          location: "report-jobPercentGaps.vue",
          defaultHeader: true,
        },
        {
          name: "reportTeacherHoursGaps",
          location: "report-hoursGaps.vue",
          defaultHeader: true,
        },
      ],
      compId: 0,
      selectedYear: 0,
      selectedMossadId: 0,
      mossadot: [],
    };
  },
  created() {
    this.getMossadot();
  },
  mounted() {
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
    onYearChange() {
      this.$store.dispatch("setSelectedYear", this.selectedYear);
      this.compId++;
    },
  },
  computed: {
    comp() {
      return () =>
        import(
          `../components/reports/${
            this.components.find((el) => el.name == this.$route.params.id)
              .location
          }`
        );
    },
    componentInstance() {
      return this.$route.params.id;
    },
    showDefalutHeader() {
      return this.components.find((el) => el.name == this.$route.params.id)
        .defaultHeader;
    },
  },
};
</script>

<style scoped>
</style>