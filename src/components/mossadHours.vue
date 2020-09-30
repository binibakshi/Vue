<template>
  <div>
    <v-data-table
      id="mossadotTable"
      :headers="mossadotHeaders"
      :items="mossadotHours"
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
                <v-col cols="12" md="3">
                  <v-select
                    :items="years"
                    v-model="mossadInfo.year"
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
              <v-btn
                color="primary"
                @click="cleanmossadInfo()"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                >הוסף שעות שנתיות
              </v-btn>
            </template>
            <v-card id="myform" class="center">
              <h1>מגבלת ש"ש</h1>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      :items="mossadot"
                      v-model="mossadInfo.mossadId"
                      item-text="mossadName"
                      item-value="mossadId"
                      label="מוסד"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      :items="years"
                      v-model="mossadInfo.year"
                      item-text="hebrewYear"
                      item-value="year"
                      label="שנה"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="mossadInfo.maxHours"
                      type="number"
                      min="0"
                      color="indigo accent-1"
                      label="מקסימום שעות"
                    ></v-text-field>
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
      <template v-slot:item.mossadName="{ item }">{{
        getMossadName(item.mossadId)
      }}</template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editMossad(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteMossad(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "mossadHours",
  components: {},

  data() {
    return {
      isNew: false,
      mossadInfo: {},
      search: "",
      years: [],
      dialog: false,
      selectedYear: { year: 2021, hebrewYear: 'תשפ"א' },
      mossadot: [],
      mossadotHours: [],
      mossadTypes: [],
      mossadotHeaders: [
        { text: "מוסד", value: "mossadName" },
        { text: "שנה", value: "year" },
        { text: "שעות בפועל", value: "currHours" },
        { text: "מקסימום שעות", value: "maxHours" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.initilize();
    this.getAllMossadotHours();
    this.getAllMossadot();
  },
  methods: {
    initilize() {
      this.years = [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ];
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
    getAllMossadotHours() {
      axios
        .get("/mossadHours/all")
        .then((response) => {
          this.mossadotHours = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getMossadName(mossadId) {
      const mossad = this.mossadot.find((el) => el.mossadId == mossadId);
      if (mossad == null) {
        return "";
      }
      return mossad.mossadName;
    },
    createMossad() {
      this.isNew = true;
      this.mossadInfo = {};
    },
    saveMossadInfo() {
      let isSaved = false;
      axios({
        url: "/mossadHours/save",
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
      this.editedIndex = this.mossadotHours.indexOf(mossad);
      this.mossadInfo = mossad;
      this.mossadInfo.year = this.selectedYear.year;
      this.dialog = true;
    },
    deleteMossad(item) {
      console.log(item)
      axios
        .delete("/mossadHours/byId", {
          params: {
            mossadId: item.mossadId,
            year: item.year,
          },
        })
        .then(() => {
          alert("פעולת המחיקה בוצעה בהצלחה");
          location.reload();
        })
        .catch((e) => console.log(e));
    },
    cleanmossadInfo() {
      this.mossadInfo = {};
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