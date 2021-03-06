<template>
  <div>
    <v-data-table
      dense
      id="mossadotTable"
      :headers="mossadotHeaders"
      :items="mossadotTable"
      :search="search"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      item-key="mossadId"
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
                    :items="$store.state.years"
                    v-model="selectedYear"
                    @change="getAllMossadotHours()"
                    item-text="hebrewYear"
                    item-value="year"
                    label="שנה"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-title>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:[`item.mossadName`]="{ item }">{{
        getMossadName(item.mossadId)
      }}</template>
      <template v-slot:[`item.maxHours`]="{ item }">
        <v-text-field
          dense
          :disabled="item.disabled"
          style="max-width: 75px"
          type="number"
          v-model="item.maxHours"
        ></v-text-field
      ></template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              @click="editMossad(item)"
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
              @click="saveMossad(item)"
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
              @click="deleteMossad(item)"
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
  name: "mossadHours",
  components: {},

  data() {
    return {
      isNew: false,
      mossadInfo: {},
      search: "",
      dialog: false,
      selectedYear: 0,
      mossadot: [],
      mossadotTable: [],
      mossadotHours: [],
      mossadTypes: [],
      mossadotHeaders: [
        { text: "מוסד", value: "mossadName" },
        { text: "מגבלת שעות", value: "maxHours" },
        { text: "שעות בפועל", value: "currHours" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
    };
  },
  async mounted() {
    this.initilize();
    await this.getAllMossadot();
    await this.getAllMossadotHours();
  },

  methods: {
    editText(item) {
      return item.disabled != false ? "ערוך" : "צפייה";
    },
    initilize() {
      let currDate = new Date();
      this.selectedYear = currDate.getFullYear();
      if (currDate.getMonth() >= 8) {
        this.selectedYear++;
      }
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
    async getAllMossadotHours() {
      await axios
        .get("/mossadHours/byYear", {
          params: {
            year: this.selectedYear,
          },
        })
        .then((response) => {
          this.mossadotHours = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
      this.orderMossadot();
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
      mossad.disabled = !mossad.disabled;
    },
    saveMossad(item) {
      axios({
        url: "/mossadHours/save",
        method: "post",
        data: item,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          this.getAllMossadotHours();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    deleteMossad(item) {
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
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    cleanmossadInfo() {
      this.mossadInfo = {};
    },
    orderMossadot() {
      this.mossadotTable = [];
      this.mossadot.forEach((el) => {
        this.mossadotTable.push({
          mossadId: el.mossadId,
          mossadName: el.mossadName,
          mossadType: el.mossadType,
          currHours: 0,
          maxHours: 0,
          year: this.selectedYear,
          disabled: true,
        });
      });

      this.mossadotTable.forEach((el) => {
        let currMossad = this.mossadotHours.find(
          (e) => e.mossadId == el.mossadId
        );
        if (currMossad != undefined) {
          el.maxHours = currMossad.maxHours;
          el.currHours = currMossad.currHours;
        }
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
.wrapper {
  /* background-color: #ffffe6; */
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