<template>
  <div>
    <v-data-table
      dense
      height="500"
      id="myTable"
      :search="search"
      :headers="headers"
      :items="tableToDisplay"
      fixed-header
      :items-per-page="50"
      class="elevation-3"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-card-title class="center title"> טבלת גמולי תפקיד </v-card-title>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            class="giveSomeSpace"
            style="max-width: 250px"
            v-model="search"
            label="חפש"
            placeholder="חפש"
            append-icon="mdi-magnify"
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="50%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >צור גמול תפקיד</v-btn
              >
              <v-btn color="red" dark class="mb-2" @click="deleteAll()"
                >מחק הכל</v-btn
              >
            </template>
            <v-card class="center">
              <h1>גמול תפקיד</h1>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="newRow.employmentCode"
                      :items="codeDescription"
                      :item-text="
                        (item) => item.code + ' - ' + item.codeDescription
                      "
                      item-value="code"
                      label="קוד פיצול"
                      placeholder="בחר קוד פיצול"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      dense
                      placeholder="תיאור"
                      type="text"
                      v-model="newRow.description"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="מינימום שעות"
                      type="number"
                      v-model="newRow.minHours"
                      min="0"
                      max="5"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="מקסימום שעות"
                      type="number"
                      v-model="newRow.maxHours"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="מינימום אחוזים"
                      min="0"
                      type="number"
                      v-model="newRow.minPercent"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="מקסימום אחוזים"
                      min="0"
                      type="number"
                      v-model="newRow.maxPercent"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="אחוזים1"
                      min="0"
                      type="number"
                      v-model="newRow.percent1"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="אחוזים2"
                      min="0"
                      type="number"
                      v-model="newRow.percent2"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="אחוזים3"
                      min="0"
                      type="number"
                      v-model="newRow.percent3"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="אחוזים4"
                      min="0"
                      type="number"
                      v-model="newRow.percent4"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="אחוזים5"
                      min="0"
                      type="number"
                      v-model="newRow.percent5"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      dense
                      placeholder="קישור"
                      min="0"
                      type="text"
                      v-model="newRow.descLink"
                    ></v-text-field
                  ></v-col>
                </v-row>
                <v-btn dense @click="closeNewRow()">סגור</v-btn>
                <v-btn dense color="blue" @click="saveRow(newRow)">שמור</v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.employmentCode`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="text"
          v-model="item.employmentCode"
        ></v-text-field
      ></template>
      <template v-slot:[`item.description`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputSize"
          type="text"
          v-model="item.description"
        ></v-text-field
      ></template>
      <template v-slot:[`item.minHours`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.minHours"
        ></v-text-field
      ></template>
      <template v-slot:[`item.maxHours`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="text"
          v-model="item.maxHours"
        ></v-text-field
      ></template>
      <template v-slot:[`item.percent1`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.percent1"
        ></v-text-field
      ></template>
      <template v-slot:[`item.percent2`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.percent2"
        ></v-text-field
      ></template>
      <template v-slot:[`item.percent3`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.percent3"
        ></v-text-field
      ></template>
      <template v-slot:[`item.percent4`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.percent4"
        ></v-text-field
      ></template>
      <template v-slot:[`item.percent5`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.percent5"
        ></v-text-field
      ></template>
      <template v-slot:[`item.minPercent`]="{ item }"
        ><v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.minPercent"
        ></v-text-field
      ></template>
      <template v-slot:[`item.maxPercent`]="{ item }"
        ><v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.maxPercent"
        ></v-text-field
      ></template>
      <template v-slot:[`item.descLink`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputSize"
          type="text"
          v-model="item.descLink"
        ></v-text-field
      ></template>
      <template v-slot:[`item.actions`]="{ item }">
        <div style="width: 100px">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon size="16" v-on="on" @click="editRow(item)"
                >mdi-pencil</v-icon
              >
            </template>
            <span>ערוך שורה</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon size="16" v-on="on" @click="duplicateRow(item)"
                >mdi-file-multiple</v-icon
              >
            </template>
            <span>שכפל שורה</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon size="16" v-on="on" @click="deleteRow(item)"
                >mdi-delete</v-icon
              >
            </template>
            <span>מחק שורה</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon size="16" v-on="on" @click="saveRow(item)"
                >mdi-content-save</v-icon
              >
            </template>
            <span>שמור שורה</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import axios from "axios";
const FRONTAL = 1;
export default {
  data() {
    return {
      search: "",
      dialog: false,
      newRow: {},
      headers: [
        { text: "פעולות", value: "actions", sortable: false },
        { text: "קוד מקצוע", value: "employmentCode" },
        { text: "תיאור", value: "description" },
        { text: "מינימום שעות", value: "minHours" },
        { text: "מקסימום שעות", value: "maxHours" },
        { text: "מינימום אחוזים", value: "minPercent" },
        { text: "מקסימום אחוזים", value: "maxPercent" },
        { text: "אחוזים1", value: "percent1" },
        { text: "אחוזים2", value: "percent2" },
        { text: "אחוזים3", value: "percent3" },
        { text: "אחוזים4", value: "percent4" },
        { text: "אחוזים5", value: "percent5" },
        { text: "קישור", value: "descLink" },
      ],
      excelHeaders: {
        employmentCode: "קוד מקצוע",
        description: "תיאור",
        minHours: "מינימום שעות",
        maxHours: "מקסימום שעות",
        minPercent: "מינימום אחוזים",
        maxPercent: "מקסימום אחוזים",
        percent1: "אחוזים1",
        percent2: "אחוזים2",
        percent3: "אחוזים3",
        percent4: "אחוזים4",
        percent5: "אחוזים5",
        descLink: "קישור",
      },
      codeDescription: [],
      jobRewardsTable: [],
      tableToDisplay: [],
      paintInRed: false,
      dataToExport: [],
      deleteTable: [],
    };
  },
  created() {
    this.getJobRewards();
    this.getCodeDescription();
  },
  methods: {
    getJobRewards() {
      axios
        .get("jobRewards/all")
        .then((response) => {
          this.jobRewardsTable = response.data;
          this.setData();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    setData() {
      this.tableToDisplay = [];
      this.jobRewardsTable.forEach((el) => {
        this.tableToDisplay.push({
          employmentCode: el.employmentCode,
          description: el.description,
          minHours: el.minHours,
          maxHours: el.maxHours,
          maxPercent: this.getTwoDigits(el.maxPercent),
          minPercent: this.getTwoDigits(el.minPercent),
          percent1: el.percent1,
          percent2: el.percent2,
          percent3: el.percent3,
          percent4: el.percent4,
          percent5: el.percent5,
          descLink: el.descLink,
          recordkey: el.recordkey,
          disabled: true,
        });
      });

      this.tableToDisplay.sort(
        (a, b) =>
          a.employmentCode - b.employmentCode ||
          a.description.localeCompare(b.description)
      );
    },
    editRow(row) {
      row.disabled = !row.disabled;
    },
    duplicateRow(row) {
      let newRow = {
        employmentCode: row.employmentCode,
        description: row.description,
        minHours: row.minHours,
        maxHours: row.maxHours,
        percent1: row.percent1,
        percent2: row.percent2,
        percent3: row.percent3,
        percent4: row.percent4,
        percent5: row.percent5,
        maxPercent: this.getTwoDigits(row.maxPercent),
        minPercent: this.getTwoDigits(row.minPercent),
        disabled: false,
      };
      let currIndex = this.tableToDisplay.indexOf(row);
      this.tableToDisplay.splice(currIndex + 1, 0, newRow);
    },
    saveRow(row) {
      axios({
        url: "/jobRewards/save",
        method: "post",
        data: row,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          this.getJobRewards();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      this.closeNewRow();
    },
    deleteRow(row) {
      let itemToDlete = this.jobRewardsTable.find(
        (el) => el.recordkey == row.recordkey
      );
      axios({
        url: "/jobRewards/delete",
        method: "delete",
        data: itemToDlete,
      })
        .then(() => {
          alert("נמחק בהצלחה");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      this.getJobRewards();
    },
    deleteAll() {
      axios
        .delete("/jobRewards/deleteAll")
        .then(() => {
          alert("הנתונים נמחקו בהצלחה");
          this.getJobRewards();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    async getCodeDescription() {
      await axios
        .get("/convertHours/all")
        .then((response) => {
          this.codeDescription = response.data.filter(
            (el) => el.hourType == FRONTAL || el.hourType == 0
          );
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    closeNewRow() {
      this.newRow = {};
      this.dialog = false;
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return 0.0;
      }
      return parseFloat(number).toFixed(2);
    },
  },
};
</script>

<style scoped>
input {
  border: 1px solid;
}
.inputSize {
  width: fit-content;
  max-height: 25px;
}
.inputNumberSize {
  width: 50px;
  padding: 0;
  max-height: 25px;
}
.title {
  font-weight: bold;
  font-size: x-large !important;
  text-decoration: underline;
}
.giveSomeSpace {
  margin: 5px;
  margin-top: 15px;
  margin-right: 2%;
  margin-left: 2%;
}
.btn {
  margin-right: 10px;
}
#myTable {
  margin-bottom: 5%;
  margin-right: 5%;
  max-width: 88%;
}

#btn {
  margin-right: 20px;
}
</style>
