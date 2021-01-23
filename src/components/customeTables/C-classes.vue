<template>
  <div>
    <v-data-table
      dense
      id="classesTable"
      :headers="classesHeaders"
      :items="classesTable"
      :search="search"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      item-key="classId"
      class="elevation-1"
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
                <v-col cols="12" md="3">
                  <v-select
                    :items="years"
                    v-model="selectedYear"
                    @change="getAllclassesHours()"
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
                >הוסף כיתה</v-btn
              >
            </template>
            <v-card id="myform" class="center">
              <h1>הגדרת כיתה</h1>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-model="editedClass.mossadId"
                        :items="mossadot"
                        color="primary"
                        hide-no-data
                        hide-selected
                        item-text="mossadName"
                        item-value="mossadId"
                        placeholder="חפש מוסד"
                        prepend-icon="mdi-database-search"
                        @change="setGradesPerMossadType()"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-select
                        v-model="editedClass.grade"
                        :disabled="editedClass.mossadId == null"
                        :items="grades"
                        color="primary"
                        hide-selected
                        item-text="text"
                        item-value="value"
                        placeholder="בחר שיכבה"
                        prepend-icon="mdi-database-search"
                        @change="setGradesPerMossadType()"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        type="number"
                        label="כיתה"
                        min="1"
                        v-model="editedClass.classNumber"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        type="number"
                        label="תלמידים בכיתה"
                        min="0"
                        v-model="editedClass.students"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-btn color="primary" @click="saveClass(editedClass)"
                    >שמור כיתה</v-btn
                  >
                  <v-btn color="grey" @click="close()">סגור</v-btn>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.mossadId`]="{ item }">{{
        getMossadName(item.mossadId)
      }}</template>
      <template v-slot:[`item.grade`]="{ item }">{{
        getGradeDexcription(item.grade)
      }}</template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              @click="editclass(item)"
              v-bind="attrs"
              v-on="on"
              >mdi-pencil</v-icon
            >
          </template>
          <span>{{ editText(item) }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              @click="saveclass(item)"
              v-bind="attrs"
              v-on="on"
              >mdi-content-save</v-icon
            >
          </template>
          <span>שמור</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              @click="deleteClass(item)"
              v-bind="attrs"
              v-on="on"
              >mdi-delete</v-icon
            >
          </template>
          <span>מחק</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "mossadClasses",
  components: {},

  data() {
    return {
      isNew: false,
      classInfo: {},
      search: "",
      years: [],
      dialog: false,
      selectedYear: 0,
      editedClass: {},
      mossadot: [],
      classesTable: [],
      classesHeaders: [
        { text: "מוסד", value: "mossadId" },
        { text: "שכבה", value: "grade" },
        { text: "כיתה", value: "classNumber" },
        { text: "תלמידים", value: "students" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
      grades: [],
    };
  },
  async mounted() {
    this.initilize();
    await this.getAllclasses();
    await this.getAllMossadot();
  },

  methods: {
    editText(item) {
      return item.disabled != false ? "ערוך" : "צפייה";
    },
    initilize() {
      this.years = [
        { year: 2021, hebrewYear: 'תשפ"א' },
        { year: 2022, hebrewYear: 'תשפ"ב' },
        { year: 2023, hebrewYear: 'תשפ"ג' },
        { year: 2024, hebrewYear: 'תשפ"ד' },
        { year: 2025, hebrewYear: 'תשפ"ה' },
      ];
      this.grades = [
        { text: "ט", value: 9 },
        { text: "י", value: 10 },
        { text: 'י"א', value: 11 },
        { text: 'י"ב', value: 12 },
      ];
      let currDate = new Date();
      this.selectedYear = currDate.getFullYear();
      if (currDate.getMonth() >= 8) {
        this.selectedYear++;
      }
    },
    getAllclasses() {
      axios
        .get("/mossadClasses/all")
        .then((response) => {
          this.classesTable = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
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
    getclassName(mossadId) {
      const obj = this.mossadot.find((el) => el.mossadId == mossadId);
      if (obj == null) {
        return "";
      }
      return obj.className;
    },
    editclass(Class) {
      this.dialog = true;
      this.editedClass = Class;
    },
    saveClass(item) {
      item.year = this.selectedYear;
      axios({
        url: "/mossadClasses/save",
        method: "post",
        data: item,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      this.close();
    },
    deleteClass(item) {
      axios({
        url: "/mossadClasses/delete",
        method: "delete",
        data: item,
      })
        .then(() => {
          alert("פעולת המחיקה בוצעה בהצלחה");
          location.reload();
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    setGradesPerMossadType() {
      this.grades = [
        { text: "ט", value: 9 },
        { text: "י", value: 10 },
        { text: 'י"א', value: 11 },
        { text: 'י"ב', value: 12 },
      ];
    },
    getMossadName(mossadId) {
      if (this.mossadot.find((el) => el.mossadId == mossadId) == null) {
        return;
      }
      return this.mossadot.find((el) => el.mossadId == mossadId).mossadName;
    },
    getGradeDexcription(grade) {
      if (this.grades.find((el) => el.value == grade) == null) {
        return;
      }
      return this.grades.find((el) => el.value == grade).text;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedClass = {};
      });
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
#classesTable {
  padding-top: 20px;
  margin-top: 1%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 3%;
  max-width: 60%;
}
input {
  border: 1px solid;
}
.header {
  justify-content: center;
  font-weight: bold;
  text-decoration: underline;
}

#searchEmployee {
  max-width: 400px;
}
#employeeTable {
  margin-bottom: 3%;
}
#myform {
  background-color: #ffffe6;
}
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  background-color: initial;
}
</style>