<template>
  <div class="wrapper">
    <div>
      <div-title>ייצוא לשכר</div-title>
      <v-row>
        <v-col v-if="$store.state.mossadId == 999" cols="12" md="2">
          <v-autocomplete
            v-model="selectedMossad"
            :items="mossadot"
            color="primary"
            hide-no-data
            hide-selected
            item-text="mossadName"
            item-value="mossadId"
            placeholder="חפש מוסד"
            prepend-icon="mdi-database-search"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-select
            style="max-hight: 40px"
            :items="$store.state.years"
            v-model="selectedYear"
            @change="setBegdaEndda()"
            item-text="hebrewYear"
            item-value="year"
            label="שנה"
          ></v-select>
        </v-col>
        <v-btn
          @click="
            createWeeklyHoursToMossad(
              selectedMossad,
              datesRange.min,
              datesRange.max
            )
          "
          color="success"
          :disabled="selectedMossad == null || selectedYear == 0"
          >ייצא לאקסל</v-btn
        >
        <v-btn @click="downloadDemoFile()" color="success">מבנה אקסל</v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import excelMixin from "../../mixins/excelMixin";

export default {
  name: "WeeklyHoursExcel",
  data() {
    return {
      selectedMossad: null,
      allEmpsInfo: null,
      codeDescription: [],
      datesRange: { min: "", max: "" },
      empsHours: [],
      dataToExport: [],
      mossadot: [],
      selectedYear: 0,
    };
  },
  created() {
    this.getCodesDescription();
    this.getAllMossadot();
  },
  mounted() {
    this.initilize();
    this.setBegdaEndda();
  },
  mixins: [excelMixin],
  methods: {
    initilize() {
      let currDate = new Date();
      this.selectedYear =
        currDate.getMonth() >= 8
          ? currDate.getFullYear() + 1
          : currDate.getFullYear();
      if (this.$store.state.logginAs == this.$store.state.logginAs) {
        this.selectedMossad = this.$store.state.logginAs;
      }
    },
    setBegdaEndda() {
      this.datesRange.min = this.FormatDate(
        new Date(this.selectedYear - 1, 8, 1)
      );
      this.datesRange.max = this.FormatDate(new Date(this.selectedYear, 5, 20));
    },
    getAllMossadot() {
      axios
        .get("/mossadot/all")
        .then((response) => {
          this.mossadot = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    FormatDate(iDate) {
      var inputDate = new Date(iDate);
      var formattedDate;
      var year = inputDate.getFullYear();
      var month = 0;
      var day = 0;

      month += inputDate.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (inputDate.getDate() < 10) {
        day = "0";
      }
      day += inputDate.getDate();
      formattedDate = year + "-" + month + "-" + day;
      return formattedDate;
    },
  },
};
</script>

<style scoped>
input {
  border: 1px solid;
}
.giveSomeSpace {
  margin: 5px;
  margin-top: 15px;
  margin-right: 2%;
}
.btn {
  margin-right: 10px;
}
#myTable {
  max-width: 70%;
  margin-top: 5%;
  margin-right: 10%;
}
#btn {
  margin-right: 20px;
}
</style>
