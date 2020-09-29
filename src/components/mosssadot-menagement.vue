<template>
  <div>
    <v-data-table
      id="mossadotTable"
      :headers="mossadotHeaders"
      :items="mossadot"
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
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    :items="years"
                    v-model="selectedYear"
                    item-text="hebrewYear"
                    item-value="year"
                    label="שנה"
                  ></v-select>
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
                      type="number"
                      v-model="mossadInfo.mossadId"
                      color="indigo accent-1"
                      label="מספר מוסד"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="mossadInfo.mossadName"
                      color="indigo accent-1"
                      label="שם מוסד"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      :items="mossadTypes"
                      v-model="mossadInfo.mossadType"
                      item-text="typeName"
                      item-value="typeId"
                      label="סוג  מוסד"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="success"
                    @click="saveMossadInfo()"
                    class="moveRight"
                    >שמור</v-btn
                  >
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.mossadType="{ item }">
        {{ getMossadType(item.mossadType) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editMossad(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteMossad(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <!-- <v-card class="wrapper" background-color="#ffffe6">
    <v-card-title primary-title>ניהול מוסדות</v-card-title>
    <v-row>
      <v-col cols="12" md="3">
        <v-autocomplete
          v-model="mossadInfo"
          :items="mossadot"
          color="primary"
          hide-no-data
          hide-selected
          item-text="mossadName"
          item-value="mossadId"
          placeholder="חפש מוסד"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2" v-if="mossadInfo.mossadId != undefined">
        <h4 class="centerize">קוד מוסד - {{mossadInfo.mossadId}}</h4>
      </v-col>
      <v-btn color="success" class="centerize" @click="createMossad()">צור מוסד</v-btn>
      <v-btn color="success" class="centerize" @click="onExport()">ייצא לאקסל</v-btn>
    </v-row>
    <mosssadDetails v-if="mossadInfo != null" :mossadInfo="mossadInfo" />
    <createMossad v-if="isNew == true && mossadInfo.mossadId == undefined" />
  </v-card> -->
  </div>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
// import mosssadDetails from "./mossad-details";
// import createMossad from "./create-mossad";

export default {
  name: "mosssadotMenagement",
  components: {
    // mosssadDetails,
    // createMossad,
  },

  data() {
    return {
      isNew: false,
      mossadInfo: {},
      search: "",
      years: [{ year: 2021, hebrewYear: 'תשפ"א' }],
      dialog: false,
      selectedYear: { year: 2021, hebrewYear: 'תשפ"א' },
      mossadot: [],
      mossadTypes: [],
      mossadotHeaders: [
        { text: "מוסד", value: "mossadName" },
        { text: "סוג מוסד", value: "mossadType" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.getAllMossadot();
    this.getmossadTypes();
  },
  computed: {
    _mossadotName() {
      return this.mossadot.map((el) => el.mossadName);
    },
  },
  methods: {
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
    getmossadTypes() {
      axios
        .get("/mossadType/all")
        .then((response) => {
          this.mossadTypes = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    createMossad() {
      this.isNew = true;
      this.mossadInfo = {};
    },
    saveMossadInfo() {
      let isSaved = false;
      axios({
        url: "/mossadot/save",
        method: "post",
        data: this.mossadInfo,
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
    editMossad(mossad) {
      this.editedIndex = this.mossadot.indexOf(mossad);
      this.mossadInfo = mossad;
      this.dialog = true;
    },
    deleteMossad(item) {
      axios
        .delete("/mossadot/byId", {
          params: {
            mossadId: item.mossadId,
          },
        })
        .then(() => {
          alert("המוסד נמחק בהצלחה");
          location.reload();
        })
        .catch((e) => console.log(e));
    },
    getMossadType(mossadType) {
      const currRecord = this.mossadTypes.find((el) => el.typeId == mossadType);
      if (currRecord != null) {
        return currRecord.typeName;
      }
      return "";
    },
    onExport() {
      // On Click Excel download button
      var temp = this.mossadot;
      temp.unshift({
        mossadId: "קוד מוסד",
        mossadName: "שם מוסד",
        mossadType: "סוג מוסד",
      });
      // export json to Worksheet of Excel
      // only array possible
      var mossadotWs = XLSX.utils.json_to_sheet(temp, {
        skipHeader: true,
        Views: [{ RTL: true }],
      });
      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel'

      // add Worksheet to Workbook
      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, mossadotWs, "מוסדות"); // sheetAName is name of Worksheet
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
  background-color: #ffffe6;
  margin-right: 150px;
  margin-top: 50px;
  max-width: 60%;
  margin-bottom: 5%;
}
#mossadotTable {
  padding-top: 20px;
  margin-top: 1%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 3%;
  max-width: 60%;
}
</style>