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
                  <!-- <v-col cols="12" md="3">
                    <v-select
                      :items="reformTypes"
                      v-model="selectedReformId"
                      label="סוג"
                    ></v-select>
                  </v-col> -->
                </v-row>
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
        <template v-slot:[`item.employmentCode`]="{ item }">
          <v-autocomplete
            :items="studyNames"
            v-model="item.studyName"
            :item-text="(i) => i.studyId + ' - ' + i.studyName"
            item-value="studyName"
            @change="onStudyNameChange(item)"
            label="מקצוע"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.hoursReward`]="{ item }">
          <v-text-field
            style="max-width: 130px"
            :disabled="item.isSplit == false"
            type="number"
            min="0"
            v-model="item.hoursReward"
            @change="onHoursRewardChange(item)"
          ></v-text-field>
        </template>
        <template v-slot:[`item.percentReward`]="{ item }">
          <p id="rewardHours">{{ getTwoDigits(item.percentReward) }}%</p>
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
        { text: "מקצוע", value: "studyName" },
        { text: 'יח"ל', value: "units" },
        { text: "שאלון", value: "questionnaire" },
        { text: "סוג", value: "isExternal" },
        { text: "כיתה", value: "teachingClass" },
        { text: "מורה נוסף", value: "isSplit" },
        { text: "תלמידים", value: "students" },
        { text: "גמול שעות", value: "hoursReward" },
        { text: "גמול אחוזים", value: "percentReward" },
        { text: "פעולות", value: "actions" },
      ],
      selectedReformId: 5,
      rewards: [],
      studyNames: [],
      tableData: [],
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
    this.studyName();
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
        .filter((el) => el.recordkey != 0)
        .forEach((el) => {
          teachersRewards.push({
            empId: this.empId,
            rewardId: el.recordkey,
            mossadId: this.$store.state.logginAs,
            reformId: this.selectedReformId,
            year: this.selectedYear,
            split: el.isSplit,
            students: el.students,
            hours: el.hoursReward,
            percent: el.percentReward,
            teachingClass: el.teachingClass,
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
        rewardId: row.recordkey,
        mossadId: this.$store.state.logginAs,
        reformId: this.selectedReformId,
        year: this.selectedYear,
        split: row.isSplit,
        students: row.students,
        hours: row.hoursReward,
        percent: row.percentReward,
        teachingClass: row.teachingClass,
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
      this.rewards = [];
      this.existData.forEach((el) => {
        currReward = this.additionalReward.find(
          (e) => e.recordkey == el.rewardId
        );
        if (currReward == undefined) {
          return;
        }
        this.rewards.push({
          isSplit: el.split,
          students: el.students,
          studyName: currReward.studyName,
          units: currReward.studyUnits,
          reformId: this.selectedReformId,
          questionnaire: currReward.questionnaire,
          isExternal: el.external,
          hoursReward: el.hours,
          percentReward: el.percent,
          recordkey: el.rewardId,
          teachingClass: el.teachingClass,
        });
      });
    },
    addNewRow() {
      this.rewards.push({
        isExternal: true,
        teachingClass: 9,
        studyName: null,
        questionnaire: "",
        isSplit: false,
        units: 0,
        students: 0,
        hoursReward: 0,
        percentReward: 0,
        recordkey: null,
      });
    },
    removeRow(row) {
      const index = this.rewards.indexOf(row);
      if (!this.existData.map((el) => el.rewardId).includes(row.recordkey)) {
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
            rewardId: row.recordkey,
            mossadId: this.$store.state.logginAs,
            year: this.selectedYear,
            class: row.teachingClass,
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
    exportToExcel() {
      var excelHeaders = {
        empId: "תעודת זהות",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        mossadName: "שם מוסד",
        year: "שנה",
        studyName: "מקצוע",
        questionnaire: "שאלון",
        studyUnits: 'יח"ל',
        teachingClass: "כיתה",
        external: "סוג",
        split: "מפוצל",
        students: "תלמידים",
        hoursReward: "גמול שעות",
        percentReward: "גמול אחוזים",
      };
      var excelData = [];

      this.rewards.forEach((el) => {
        excelData.push({
          empId: this.empId,
          firstName: this.empData.firstName,
          lastName: this.empData.lastName,
          mossadName: this.$store.state.mossadInfo.mossadName,
          year: this.selectedYear,
          studyName: el.studyName,
          questionnaire: el.questionnaire,
          studyUnits: el.units,
          external: this.isExternalRange.find((e) => e.value == el.isExternal)
            .text,
          teachingClass: this.classes.find((e) => e.value == el.teachingClass)
            .text,
          split: this.isSplitedRange.find((e) => e.value == el.isSplit).text,
          students: el.students,
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
  },
  watch: {
    empId: function (val) {
      this.empId = val;
      this.initilize();
    },
    existData: function () {
      this.initilize();
      this.setExistData();
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