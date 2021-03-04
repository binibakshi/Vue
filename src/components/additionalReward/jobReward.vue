<template>
  <div>
    <v-card>
      <v-data-table
        v-if="empId != null"
        dense
        :headers="headers"
        :items="rewards"
        :search="search"
        :hide-default-footer="true"
        disable-pagination
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>
              <v-card-title>
                <v-text-field
                  v-model="search"
                  label="Search"
                  placeholder="חפש"
                  single-line
                  autocomplete="off"
                  hide-details
                  append-icon="mdi-magnify"
                ></v-text-field>
              </v-card-title>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn dense color="success" @click="exportToExcel()"
              >ייצא לאקסל</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:footer>
          <div class="center">
            <v-btn dense color="info" @click="addNewRow()">הוסף שורה</v-btn>
            <v-btn dense color="success" @click="saveAll()">שמור הכל</v-btn>
          </div>
        </template>
        <template v-slot:[`item.rewardId`]="{ item }">
          <v-autocomplete
            :items="additionalReward"
            v-model="item.rewardId"
            :item-text="(i) => i.employmentCode + ' - ' + i.description"
            item-value="recordkey"
            label="גמול"
            @change="handleRewardSelected(item)"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.hoursReward`]="{ item }">
          <v-text-field
            :disabled="item.rewardId == null"
            type="number"
            min="0"
            v-model="item.hoursReward"
            v-bind:label="item.hoursLabel"
            @change="handleHoursChanged(item)"
          ></v-text-field>
        </template>
        <template v-slot:[`item.percentReward`]="{ item }">
          <v-select
            v-if="item.minPercent == 0"
            :items="getPercentOptions(item)"
            v-model="item.percentReward"
            label="בחר"
          ></v-select>
          <v-text-field
            v-else
            :disabled="item.rewardId == null"
            type="number"
            min="0"
            v-bind:label="item.percentLabel"
            v-model="item.percentReward"
            @change="handlePercentChanged(item)"
          ></v-text-field>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-icon size="16" v-on="on" @click="removeRow(item)"
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
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";
import excelMixin from "../../mixins/excelMixin";
export default {
  props: ["empId", "empData", "selectedYear", "additionalReward", "existData"],
  mixins: [excelMixin],
  data() {
    return {
      search: "",
      headers: [
        { text: "מקצוע", value: "rewardId" },
        { text: "גמול שעות", value: "hoursReward" },
        { text: "גמול אחוזים", value: "percentReward" },
        { text: "פעולות", value: "actions" },
      ],
      selectedReformId: 5,
      rewards: [],
      tableData: [],
      hoursLabel: "",
      percentLabel: "",
      reformTypes: [
        {
          text: "עוז לתמורה",
          value: 5,
        },
        {
          text: "עולם ישן",
          value: 1,
        },
      ],
    };
  },
  mounted() {
    this.initilize();
    this.setExistData();
  },
  methods: {
    initilize() {
      this.rewards = [];
      this.addNewRow();
    },
    saveAll() {
      var teachersRewards = [];
      this.rewards
        .filter((el) => el.rewardId != 0)
        .forEach((el) => {
          teachersRewards.push({
            empId: this.empId,
            rewardId: el.rewardId,
            mossadId: this.$store.state.logginAs,
            reformId: this.selectedReformId,
            year: this.selectedYear,
            hours: el.hoursReward,
            percent: el.percentReward,
            rewardType: 2,
          });
        });
      axios({
        url: "/teachersRewards/saveAll",
        method: "post",
        data: teachersRewards,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          bus.$emit("reloadBagrutDataPerMossad");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    saveRow(row) {
      var teachersRewards = [];
      teachersRewards.push({
        empId: this.empId,
        rewardId: row.rewardId,
        mossadId: this.$store.state.logginAs,
        reformId: this.selectedReformId,
        year: this.selectedYear,
        hours: row.hoursReward,
        percent: row.percentReward,
        rewardType: 2,
      });
      axios({
        url: "/teachersRewards/saveAll",
        method: "post",
        data: teachersRewards,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    setExistData() {
      if (this.existData.length == 0 || this.additionalReward.length == 0) {
        return;
      }
      var currReward = {};
      var newRow = {};
      this.rewards = [];

      this.existData.forEach((el) => {
        currReward = this.additionalReward.find(
          (e) => e.recordkey == el.rewardId
        );
        if (currReward == undefined) {
          return;
        }
        newRow = {
          hoursReward: el.hours,
          percentReward: el.percent,
          rewardId: el.rewardId,
          minHours: currReward.minHours,
          maxHours: currReward.maxHours,
          minPercent: currReward.minPercent,
          maxPercent: currReward.maxPercent,
        };
        this.changeLabelText(newRow);
        this.rewards.push(newRow);
      });
    },
    changeLabelText(row) {
      const currReward = this.additionalReward.find(
        (el) => el.recordkey == row.rewardId
      );
      row.hoursLabel =
        " אפשר להזין " + currReward.minHours + " - " + currReward.maxHours;
      row.percentLabel =
        " אפשר להזין " + currReward.minPercent + " - " + currReward.maxPercent;
    },
    addNewRow() {
      this.rewards.push({
        hoursReward: 0,
        percentReward: 0,
        rewardId: null,
        minHours: 0,
        maxHours: 0,
        minPercent: 0,
        maxPercent: 0,
      });
    },
    removeRow(row) {
      const index = this.rewards.indexOf(row);
      if (!this.existData.map((el) => el.rewardId).includes(row.rewardId)) {
        this.rewards.splice(index, 1);
        if (index === 0) {
          this.addNewRow();
        }
        return;
      }
      if (!confirm("האם למחוק שורה זו?")) {
        return;
      }
      axios
        .delete("/teachersRewards/delete", {
          params: {
            empId: this.empId,
            rewardId: row.rewardId,
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
            class: 0,
            rewardType: 2,
          },
        })
        .then(() => {
          alert("הנתונים נמחקו בהצלחה");
          this.rewards.splice(index, 1);
          if (index === 0) {
            this.addNewRow();
          }
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    handleRewardSelected(row) {
      const currReward = this.additionalReward.find(
        (el) => el.recordkey == row.rewardId
      );
      row.minHours = currReward.minHours;
      row.maxHours = currReward.maxHours;
      row.minPercent = currReward.minPercent;
      row.maxPercent = currReward.maxPercent;

      this.changeLabelText(row);
    },
    handleHoursChanged(row) {
      const currReward = this.additionalReward.find(
        (el) => el.recordkey == row.rewardId
      );
      if (row.hoursReward < currReward.minHours) {
        row.hoursReward = currReward.minHours;
      }
      if (row.hoursReward > currReward.maxHours) {
        row.hoursReward = currReward.maxHours;
      }
    },
    handlePercentChanged(row) {
      const currReward = this.additionalReward.find(
        (el) => el.recordkey == row.rewardId
      );
      if (row.percentReward < currReward.minPercent) {
        row.percentReward = currReward.minPercent;
      }
      if (row.percentReward > currReward.maxPercent) {
        row.percentReward = currReward.maxPercent;
      }
    },
    exportToExcel() {
      var excelHeaders = {
        empId: "תעודת זהות",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        mossadName: "שם מוסד",
        year: "שנה",
        employmentCode: "קוד פיצול",
        description: "תיאור",
        hoursReward: "גמול שעות",
        percentReward: "גמול אחוזים",
      };
      var excelData = [];

      this.rewards.forEach((el) => {
        let currReward = this.additionalReward.find(
          (e) => e.recordkey == el.rewardId
        );
        excelData.push({
          empId: this.empId,
          firstName: this.empData.firstName,
          lastName: this.empData.lastName,
          mossadName: this.$store.state.mossadInfo.mossadName,
          year: this.selectedYear,
          employmentCode: currReward.employmentCode,
          description: currReward.description,
          hoursReward: el.hoursReward,
          percentReward: el.percentReward,
        });
      });

      this.downloadFile(
        excelData,
        excelHeaders,
        "גמולי בגרות.xlsx",
        "גמולי בגרות"
      );
    },
    getTwoDigits(number) {
      if (isNaN(number)) {
        return 0.0;
      }
      return parseFloat(number).toFixed(2);
    },
    getPercentOptions(row) {
      if (!row.rewardId) {
        return;
      }
      const currReward = this.additionalReward.find(
        (el) => el.recordkey == row.rewardId
      );
      let range = [
        currReward.percent1,
        currReward.percent2,
        currReward.percent3,
        currReward.percent4,
        currReward.percent5,
      ];
      return range.filter((el) => el != 0);
    },
  },
};
</script>

<style scoped>
.text-xs-right {
  white-space: nowrap;
  /* To help visualize the fact that the container is too small */
  width: 10px;
  /* border: 1px solid #ddd; */
}
</style>