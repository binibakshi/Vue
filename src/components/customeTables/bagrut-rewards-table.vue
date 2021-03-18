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
            <v-card-title class="center title"> טבלת גמולי בגרות </v-card-title>
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
              <h1>גמול בגרות</h1>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder="קוד מקצוע"
                      type="number"
                      v-model="newRow.studyId"
                      min="0"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      dense
                      placeholder="מקצוע"
                      type="text"
                      v-model="newRow.studyName"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      dense
                      placeholder='יח"ל'
                      type="number"
                      v-model="newRow.studyUnits"
                      min="0"
                      max="5"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      dense
                      placeholder="שאלון"
                      type="text"
                      v-model="newRow.questionnaire"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      dense
                      placeholder="שעות פנימי"
                      min="0"
                      type="number"
                      v-model="newRow.internalHoursReward"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      dense
                      placeholder="אחוזים פנימי"
                      min="0"
                      type="number"
                      v-model="newRow.internalPercentReward"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      dense
                      placeholder="שעות חיצוני"
                      min="0"
                      type="number"
                      v-model="newRow.externalHoursReward"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      dense
                      placeholder="אחוזים חיצוני"
                      min="0"
                      type="number"
                      v-model="newRow.externalPercentReward"
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
      <template v-slot:[`item.studyId`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="text"
          v-model="item.studyId"
        ></v-text-field
      ></template>
      <template v-slot:[`item.studyName`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputSize"
          type="text"
          v-model="item.studyName"
        ></v-text-field
      ></template>
      <template v-slot:[`item.studyUnits`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.studyUnits"
        ></v-text-field
      ></template>
      <template v-slot:[`item.questionnaire`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputSize"
          type="text"
          v-model="item.questionnaire"
        ></v-text-field
      ></template>
      <template v-slot:[`item.internalHoursReward`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.internalHoursReward"
        ></v-text-field
      ></template>
      <template v-slot:[`item.externalPercentReward`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.externalPercentReward"
        ></v-text-field
      ></template>
      <template v-slot:[`item.externalHoursReward`]="{ item }"
        ><v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.externalHoursReward"
        ></v-text-field
      ></template>
      <template v-slot:[`item.internalPercentReward`]="{ item }"
        ><v-text-field
          dense
          :disabled="item.disabled"
          class="inputNumberSize"
          type="number"
          v-model="item.internalPercentReward"
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

export default {
  data() {
    return {
      search: "",
      dialog: false,
      newRow: {},
      headers: [
        { text: "פעולות", value: "actions", sortable: false },
        { text: "קוד מקצוע", value: "studyId" },
        { text: "מקצוע", value: "studyName" },
        { text: 'יח"ל', value: "studyUnits" },
        { text: "שאלון", value: "questionnaire" },
        { text: "שעות פנימי", value: "internalHoursReward" },
        { text: "אחוזים פנימי", value: "internalPercentReward" },
        { text: "שעות חיצוני", value: "externalHoursReward" },
        { text: "אחוזים חיצוני", value: "externalPercentReward" },
      ],
      excelHeaders: {
        studyId: "קוד מקצוע",
        studyName: "מקצוע",
        studyUnits: 'יח"ל',
        questionnaire: "שאלון",
        internalHoursReward: "שעות פנימי",
        internalPercentReward: "אחוזים פנימי",
        externalHoursReward: "שעות חיצוני",
        externalPercentReward: "אחוזים חיצוני",
      },
      bagrutRewardsTable: [],
      tableToDisplay: [],
      paintInRed: false,
      dataToExport: [],
      deleteTable: [],
    };
  },
  created() {
    this.getBagrutRewards();
  },
  methods: {
    getBagrutRewards() {
      axios
        .get("bagrutRewards/all")
        .then((response) => {
          this.bagrutRewardsTable = response.data;
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
      this.bagrutRewardsTable.forEach((el) => {
        this.tableToDisplay.push({
          studyId: el.studyId,
          studyName: el.studyName,
          studyUnits: el.studyUnits,
          questionnaire: el.questionnaire,
          internalHoursReward: this.getTwoDigits(el.internalHoursReward),
          internalPercentReward: this.getTwoDigits(el.internalPercentReward),
          externalHoursReward: this.getTwoDigits(el.externalHoursReward),
          externalPercentReward: this.getTwoDigits(el.externalPercentReward),
          recordkey: el.recordkey,
          disabled: true,
        });
      });

      this.tableToDisplay.sort(
        (a, b) =>
          a.studyId - b.studyId || a.studyName.localeCompare(b.studyName)
      );
    },
    editRow(row) {
      row.disabled = !row.disabled;
    },
    duplicateRow(row) {
      let newRow = {
        studyId: row.studyId,
        studyName: row.studyName,
        studyUnits: row.studyUnits,
        questionnaire: row.questionnaire,
        internalHoursReward: this.getTwoDigits(row.internalHoursReward),
        internalPercentReward: this.getTwoDigits(row.internalPercentReward),
        externalHoursReward: this.getTwoDigits(row.externalHoursReward),
        externalPercentReward: this.getTwoDigits(row.externalPercentReward),
        disabled: false,
      };
      let currIndex = this.tableToDisplay.indexOf(row);
      this.tableToDisplay.splice(currIndex + 1, 0, newRow);
    },
    saveRow(row) {
      axios({
        url: "/bagrutRewards/save",
        method: "post",
        data: row,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          this.getBagrutRewards();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      this.closeNewRow();
    },
    deleteRow(row) {
      let itemToDlete = this.bagrutRewardsTable.find(
        (el) => el.recordkey == row.recordkey
      );
      axios({
        url: "/bagrutRewards/delete",
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
      this.getBagrutRewards();
    },
    deleteAll() {
      axios
        .delete("/bagrutRewards/deleteAll")
        .then(() => {
          alert("הנתונים נמחקו בהצלחה");
          this.getBagrutRewards();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
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
  width: fit-content;
  padding: 0;
  max-height: 25px;
}
.giveSomeSpace {
  margin: 5px;
  margin-top: 15px;
  margin-right: 2%;
}
.title {
  font-weight: bold;
  font-size: x-large !important;
  text-decoration: underline;
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
