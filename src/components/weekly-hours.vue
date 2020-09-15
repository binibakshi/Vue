<template>
  <div v-if="empId != null">
    <h1>{{ _reformDiscription }}</h1>
    <div v-for="(table,index) in tablesArray" :key="index">
      <weeklyHoursTable
        :empId="empId"
        :reformType="reformType"
        :isMother="isMother"
        :ageHours="ageHours"
        :existData="table.data"
        :begda="table.begda"
        :endda="table.endda"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import { bus } from "../main";
import weeklyHoursTable from "./weekly-hours-table";

const FRONTAL = 1;

export default {
  name: "weeklyHours",
  props: ["empId", "reformType", "isMother", "ageHours"],
  components: { weeklyHoursTable },
  data() {
    return {
      newHours: [],
      tableBegda: "",
      tableEndda: "",
      datesRange: {
        min: "",
        max: "",
      },
      tableToSave: [],
      tablesArray: [],
      empOptions: [],
      reformTypes: [],
      codeDescription: [],
      existHours: [],
      frontalConst: FRONTAL,
    };
  },
  created() {
    this.getReformTypes();
    this.setBegdaEndda();
    this.getExistData();
  },
  methods: {
    getExistData() {
      axios
        .get("/teacherEmploymentDetails/byReform", {
          params: {
            empId: this.empId,
            mossadId: this.$store.state.logginAuth,
            reformType: this.reformType,
            begda: this.begda,
            endda: this.endda,
          },
        })
        .then((response) => {
          this.existHours = response.data;
          // if (this.existHours != null) {
          // this.setExistHours();
          this.gruopByBegdaEndda();
          // }
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    async gruopByBegdaEndda() {
      await this.existHours.forEach((el) => {
        let currArray = this.tablesArray.find(
          (e) => e.begda == el.begda && e.endda == el.endda
        );
        if (currArray != null) {
          currArray.data.push(el);
        } else {
          this.tablesArray.push({
            begda: el.begda,
            endda: el.endda,
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
      var currDate = new Date();
      var year = currDate.getFullYear();
      if (currDate.getMonth() >= 8) {
        year = currDate.getFullYear() + 1;
      }
      this.begda = this.FormatDate(new Date(year - 1, 8, 1));
      this.endda = this.FormatDate(new Date(year, 5, 30));
      this.tableBegda = this.begda;
      this.tableEndda = this.endda;
    },
    setDefualtValues() {
      if (this.tablesArray.length == 0) {
        this.tablesArray.push({
          begda: this.begda,
          endda: this.endda,
          data: {},
        });
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
    _filteredCodes() {
      return this.codeDescription.filter(
        (el) =>
          (el.hourType == FRONTAL || el.hourType == 0) &&
          !this.newHours.find((i) => i.code == el.code)
      );
    },
  },
  watch: {
    empId: function (val) {
      this.empId = val;
      // this.initilizer();
      // this.getCodeDescription();
      // this.getEmployeeOptions();
      this.getExistData();
    },
    reformType: function (val) {
      this.reformType = val;
      // this.initilizer();
      // this.getCodeDescription();
      // this.getEmployeeOptions();
      this.getExistData();
    },
  },
};
</script>

<style scoped>
#autocomlete {
  max-width: 50px;
  max-height: 25px;
  padding-top: 0;
}

table,
tr,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
  font-weight: bold;
}
tbody {
  display: table-row-group;
  vertical-align: inherit;
  border-block: inherit;
}
thead {
  display: table-header-group;
  vertical-align: inherit;
  border-color: inherit;
}
input {
  /* border: 1px solid; */
  max-width: 50px;
}
table#t01 td:nth-child() {
  background-color: #eee;
}
.disableStyle {
  background-color: #eff0f1;
}
option,
select {
  border: 1px solid black;
}
input:disabled {
  background-color: #eff0f1;
}
.myBtn {
  padding: 1px;
  margin: 5px;
  /* margin-left: 10px; */
}
table {
  max-width: 98%;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
p {
  font-weight: bold;
  text-decoration: underline;
}
.centerize {
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
}
.summaryRow {
  background: #c2c2d6;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
