<template>
  <div> 
    <v-row class="center">
      <v-col cols="12" md="3">
        <v-autocomplete
          class="myMaxWindth"
          v-model="reformType"
          :items="reformTable"
          hide-selected
          :item-text="item => item.reformId +' '+ item.name"
          item-value="reformId"
          label="רפורמה"
          placeholder="בחר"
          @change="filterTable()"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          class="myMaxWindth"
          v-model="ageHours"
          :items="ageHoursTable"
          hide-selected
          item-text="text"
          item-value="value"
          label="שעות גיל"
          placeholder="בחר"
          @change="filterTable()"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
          class="myMaxWindth"
          v-model="isMother"
          :items="isMotherTable"
          hide-selected
          item-text="text"
          item-value="value"
          label="משרת אם"
          placeholder="בחר"
          @change="filterTable()"
        ></v-autocomplete>
      </v-col>
    </v-row>

    <v-data-table
      v-if="dataToTable.length > 0"
      dense
      id="myTable"
      :headers="headers"
      :items="dataToTable"
      :items-per-page="50"
      class="elevation-1 center"
    >
    
    <template v-slot:item.jobPercent="{ item }"><p>{{item.jobPercent}}</p></template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "calcHoursTable",
  data() {
    return {
      headers: [],
      reformType: "",
      ageHours: "",
      isMother: "",
      reformTable: [],
      ageHoursTable: [],
      isMotherTable: [],
      empCodesTable: [],
      dataToTable: [],
    };
  },

  created() {
    this.initilizer();
    this.getReforms();
    this.getEmploymentcodes();
  },
  methods: {
    initilizer() {
      this.headers = [
        { text: "שעות גיל", value: "ageHours" },
        { text: "משרת אם", value: "mother" },
        { text: "שעות פרונטליות", value: "frontalHours" },
        { text: "שעות שהייה", value: "pauseHours" },
        { text: "שעות פרטניות", value: "privateHours" },
        { text: "אחוז משרה", value: "jobPercent" },
      ];
      this.ageHoursTable = [
        { text: "הכל", value: "" },
        { text: "0", value: "0" },
        { text: "2", value: "2" },
        { text: "4", value: "4" },
      ];
      this.isMotherTable = [
        { text: "הכל", value: "" },
        { text: "כן", value: true },
        { text: "לא", value: false },
      ];
    },
    getReforms() {
      axios
        .get("/reformTypes/all")
        .then(
          (response) =>
            (this.reformTable = response.data.filter(
              (el) => el.reformId == 1 || el.reformId == 2 || el.reformId == 5
            ))
        );
    },
    getEmploymentcodes() {
      axios.get("/calcHours/all").then((response) => {
        this.empCodesTable = response.data;
      });
    },

    filterTable() {
      this.dataToTable = [];
      this.empCodesTable.forEach((el) => {
        if (
          (el.reformType == this.reformType || this.reformType == null) &&
          (el.mother == this.isMother || this.isMother == "") &&
          (el.ageHours == this.ageHours || this.ageHours == "")
        ) {
          this.dataToTable.push({
            ageHours: el.ageHours,
            mother: this.formatMotherType(el.mother),
            frontalHours: el.frontalHours,
            pauseHours: el.pauseHours,
            privateHours: el.privateHours,
            jobPercent: el.jobPercent + "%",
          });
        }
      });
    },
    formatMotherType(mother) {
      if (mother == true) {
        return "כן";
      }
      return "לא";
    },
  },
};
</script>

<style scoped>
#serchReform {
  max-width: 400px;
}
#myTable{
  max-width: 80%;
}
.myMaxWindth {
  max-width: 250px;
}
p{
  font-weight: bold;
}
</style>