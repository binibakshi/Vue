<template>
  <div v-if="empId != null" class="reformTypeTables">
    <h1 class="center">{{ _reformDiscription }}</h1>
    <div v-for="(table, index) in tablesArray" :key="index">
      <v-row class="center">
        <v-col cols="12" md="2" sm="2">
          <v-text-field
            v-model="table.begda"
            label="מתאריך"
            type="date"
            :min="datesRange.min"
            :max="datesRange.max"
            @change="setDatesIfChange(table)"
            >מתאריך</v-text-field
          >
        </v-col>
        <v-col cols="12" md="2" sm="2">
          <v-text-field
            v-model="table.endda"
            label="עד תאריך"
            type="date"
            :min="datesRange.min"
            :max="datesRange.max"
            @change="setDatesIfChange(table)"
            >עד תאריך</v-text-field
          >
        </v-col>
        <weeklyHoursTable
          :empId="empId"
          :reformType="reformType"
          :isMother="isMother"
          :ageHours="ageHours"
          :existData="table.data"
          :begda="table.begda"
          :endda="table.endda"
          :codeDescription="codeDescription"
          :rewardHours="rewardHours"
        />
      </v-row>
    </div>
    <!-- <v-row>
      <v-icon id="myPlusIcon" @click="addWeeklHoursTable()">mdi-plus</v-icon>
      <v-icon id="myMinusIcon" @click="removeWeeklHoursTable()">mdi-minus</v-icon>
    </v-row> -->
  </div>
</template>

<script>
import axios from "axios";
import weeklyHoursTable from "./weekly-hours-table";

export default {
  name: "weeklyHours",
  props: [
    "empId",
    "reformType",
    "isMother",
    "ageHours",
    "selectedYear",
    "codeDescription",
    "existData",
    "rewardHours",
  ],
  components: { weeklyHoursTable },
  data() {
    return {
      datesRange: {
        min: "",
        max: "",
      },
      tablesArray: [],
      reformTypes: [],
    };
  },
  created() {
    this.getReformTypes();
  },
  mounted() {
    this.setBegdaEndda();
    this.gruopByBegdaEndda();
  },
  methods: {
    gruopByBegdaEndda() {
      this.tablesArray = [];
      this.existData.forEach((el) => {
        let currArray = this.tablesArray.find(
          (e) =>
            e.begda == this.FormatDate(el.begda) &&
            e.endda == this.FormatDate(el.endda)
        );
        if (currArray != null) {
          currArray.data.push(el);
        } else {
          this.tablesArray.push({
            begda: this.FormatDate(el.begda),
            endda: this.FormatDate(el.endda),
            data: [el],
          });
        }
      });
      this.setDefualtValues();
    },
    getReformTypes() {
      axios
        .get("/reformTypes/relevant")
        .then((response) => {
          this.reformTypes = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    setBegdaEndda() {
      this.datesRange.min = new Date(this.selectedYear - 1, 8, 1);
      this.datesRange.max = new Date(this.selectedYear, 5, 20);
    },
    setDefualtValues() {
      if (this.tablesArray.length == 0) {
        this.tablesArray.push({
          begda: this.FormatDate(this.datesRange.min),
          endda: this.FormatDate(this.datesRange.max),
          data: [],
        });
      }
    },
    addWeeklHoursTable() {
      const maxCurrDate = new Date(
        this.tablesArray.reduce((a, b) => (a.endda > b.endda ? a : b)).endda
      );
      maxCurrDate.setDate(maxCurrDate.getDate() + 1);
      if (maxCurrDate < this.datesRange.max) {
        this.tablesArray.push({
          begda: this.FormatDate(maxCurrDate),
          endda: this.FormatDate(this.datesRange.max),
          data: [],
        });
      } else {
        alert("אין אפשרות ליצור יותר מרושמה אחת על תאריכים חופפים");
      }
    },
    removeWeeklHoursTable() {
      this.tablesArray.pop();
    },
    setDatesIfChange(datesRange) {
      if (
        datesRange.endda > this.FormatDate(this.datesRange.max) ||
        datesRange.endda < this.FormatDate(this.datesRange.min)
      ) {
        datesRange.endda = this.FormatDate(this.datesRange.max);
      }
      if (
        datesRange.begda > this.FormatDate(this.datesRange.max) ||
        datesRange.begda < this.FormatDate(this.datesRange.min)
      ) {
        datesRange.begda = this.FormatDate(this.datesRange.min);
      }
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
  computed: {
    _reformDiscription() {
      var name = this.reformTypes.find((el) => el.reformId == this.reformType);
      if (name != undefined) {
        return name.name;
      }
      return "";
    },
  },
  watch: {
    // empId: function (val) {
    //   this.empId = val;
    // },
    // reformType: function (val) {
    //   this.reformType = val;
    // },
    // selectedYear: function (val) {
    //   this.selectedYear = val;
    //   this.tablesArray = [];
    //   this.setBegdaEndda();
    // },
    // existData: function (val) {
    //   console.log("this is 1" + val);
    //   this.existData = val;
    //   this.setBegdaEndda();
    //   this.gruopByBegdaEndda();
    // },
  },
};
</script>

<style scoped>
.container {
  display: flex;
}
.fixed {
  width: 18%;
}
.flex-item {
  flex-grow: 1;
}
#myPlusIcon {
  color: blue;
}
#myMinusIcon {
  color: red;
}
#myPlusIcon:hover {
  size: 150%;

  transform: scale(3);
}
#myMinusIcon:hover {
  size: 150%;
  transform: scale(3);
}
.reformTypeTables {
  margin-right: 1%;
  margin-bottom: 15px;
  /* border-bottom: 1px solid black; */
}
</style>
