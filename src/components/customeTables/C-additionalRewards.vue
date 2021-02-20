<template>
  <div>
    <v-data-table
      id="additionalrewardsTable"
      :headers="additionalrewardsHeaders"
      :items="additionalrewards"
      :search="search"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      class="elevation-3"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-card-title>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="search"
                    label="Search"
                    placeholder="חפש"
                    single-line
                    autocomplete="off"
                    hide-details
                    append-icon="mdi-magnify"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="50%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"
                >צור מוסד</v-btn
              >
            </template>
            <v-card id="myform" class="center">
              <h1>פרטי מוסד</h1>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model="selection.profession"
                      @change="onProfessionChange()"
                      label="מקצוע"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-text-field
                      label='יח"ל'
                      v-model="selection.units"
                      type="number"
                      min="1"
                      max="5"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field
                      v-model="selection.questionnaire"
                      label="שאלון"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-text-field label="פנימי/חיצוני" id="id"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="1">
                    <v-text-field
                      label="גמול שעות"
                      v-model="selection.hoursReward"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="success"
                    @click="saveadditionalRewardInfo()"
                    class="moveRight"
                    >שמור</v-btn
                  >
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.additionalRewardType`]="{ item }">
        {{ getadditionalRewardType(item.additionalRewardType) }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editadditionalReward(item)"
          >mdi-pencil</v-icon
        >
        <v-icon small @click="deleteadditionalReward(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";

export default {
  name: "additionalrewardsMenagement",
  components: {},

  data() {
    return {
      isNew: false,
      additionalRewardInfo: {},
      search: "",
      dialog: false,
      additionalrewards: [],
      additionalRewardTypes: [],
      additionalrewardsHeaders: [
        { text: "מקצוע", value: "profession" },
        { text: 'יח"ל', value: "studyUnits" },
        { text: "שאלון", value: "questionnaire" },
        { text: "פנימי/חיצוני", value: "isExternal" },
        { text: "גמול שעות", value: "hoursReward" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.getAllAdditionalRewards();
  },
  methods: {
    getAllAdditionalRewards() {
      axios
        .get("/additionalRewards/all")
        .then((response) => {
          this.additionalrewards = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    createAdditionalReward() {
      this.isNew = true;
      this.additionalRewardInfo = {};
    },
    saveAdditionalRewardInfo() {
      let isSaved = false;
      axios({
        url: "/additionalrewards/save",
        method: "post",
        data: this.additionalRewardInfo,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          isSaved = true;
          location.reload();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      return isSaved;
    },
    editAdditionalReward(additionalReward) {
      this.editedIndex = this.additionalrewards.indexOf(additionalReward);
      this.additionalRewardInfo = additionalReward;
      this.dialog = true;
    },
    deleteAdditionalReward(item) {
      axios
        .delete("/additionalrewards/byId", {
          params: {
            additionalRewardId: item.additionalRewardId,
          },
        })
        .then(() => {
          alert("המוסד נמחק בהצלחה");
          location.reload();
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getMossadType(additionalRewardType) {
      const currRecord = this.additionalRewardTypes.find(
        (el) => el.typeId == additionalRewardType
      );
      if (currRecord != null) {
        return currRecord.typeName;
      }
      return "";
    },
    onExport() {
      // On Click Excel download button
      var temp = this.additionalrewards;
      temp.unshift({
        additionalRewardId: "קוד מוסד",
        additionalRewardName: "שם מוסד",
        additionalRewardType: "סוג מוסד",
      });
      // export json to Worksheet of Excel
      // only array possible
      var additionalrewardsWs = XLSX.utils.json_to_sheet(temp, {
        skipHeader: true,
        Views: [{ RTL: true }],
      });
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel'

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, additionalrewardsWs, "מוסדות"); // sheetAName is name of Worksheet
      this.set_right_to_left(wb);

      // export Excel file
      XLSX.writeFile(wb, "מוסדות.xlsx"); // name of the file is 'book.xlsx'
    },
    set_right_to_left(wb /*:Workbook*/) {
      if (!wb.Workbook) wb.Workbook = {};
      if (!wb.Workbook.Views) wb.Workbook.Views = [];
      if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
      wb.Workbook.Views[0].RTL = true;
    },
  },
};
</script>

<style scoped>
p {
  text-align: center;
  text-decoration: underline;
  font-weight: bold;
}
.wrapper {
  /* background-color: #ffffe6; */
  margin-right: 150px;
  margin-top: 50px;
  max-width: 60%;
  margin-bottom: 5%;
}
#additionalrewardsTable {
  padding-top: 20px;
  margin-top: 1%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 3%;
  max-width: 60%;
}
</style>