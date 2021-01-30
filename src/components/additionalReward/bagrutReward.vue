<template>
  <v-container grid-list-xs>
    <v-card>
      <v-data-table
        v-if="empId != null"
        dense
        id="rewardsTable"
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
        <template v-slot:[`item.studyName`]="{ item }">
          <v-autocomplete
            :items="studyNames"
            v-model="item.studyName"
            @change="onStudyNameChange(item)"
            label="מקצוע"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.units`]="{ item }">
          <v-select
            label='יח"ל'
            v-model="item.units"
            :items="getUnits(item)"
            @input="getHoursReward(item)"
          ></v-select>
        </template>
        <template v-slot:[`item.questionnaire`]="{ item }">
          <v-select
            :items="getQuestionnaires(item.studyName)"
            :disabled="getQuestionnaires(item.studyName).length == 0"
            v-model="item.questionnaire"
            @change="onQuestionnairesChange(item)"
            label="שאלון"
          ></v-select>
        </template>
        <template v-slot:[`item.isExternal`]="{ item }">
          <v-select
            :items="isExternalRange"
            @change="onBagrutTypeChange(item)"
            v-model="item.isExternal"
            label="סוג"
          ></v-select>
        </template>
        <template v-slot:[`item.reformId`]="{ item }">
          <v-select
            :items="reformTypes"
            v-model="item.reformId"
            label="סוג"
          ></v-select>
        </template>
        <template v-slot:[`item.teachingClass`]="{ item }">
          <v-select
            :items="classes"
            v-model="item.teachingClass"
            label="כיתה"
          ></v-select>
        </template>
        <template v-slot:[`item.students`]="{ item }">
          <v-text-field
            label="תלמידים"
            v-model="item.students"
            type="number"
            min="1"
            @input="onStudentsChange(item)"
          ></v-text-field>
        </template>
        <template v-slot:[`item.isSplit`]="{ item }">
          <v-select
            :items="isSplitedRange"
            v-model="item.isSplit"
            label="האם לפצל"
            @change="onIsSplitChange(item)"
          ></v-select>
        </template>
        <template v-slot:[`item.hoursReward`]="{ item }">
          <v-text-field
            :disabled="item.isSplit == false"
            type="number"
            min="0"
            v-model="item.hoursReward"
            @change="onHoursRewardChange(item)"
          ></v-text-field>
        </template>
        <template v-slot:[`item.percentReward`]="{ item }">
          <p id="rewardHours">{{ item.percentReward }}%</p>
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
  </v-container>
</template>

<script>
import axios from "axios";
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
        { text: "רפורמה", value: "reformId" },
        { text: "כיתה", value: "teachingClass" },
        { text: "האם לפצל", value: "isSplit" },
        { text: "תלמידים", value: "students" },
        { text: "גמול שעות", value: "hoursReward" },
        { text: "גמול אחוזים", value: "percentReward" },
        { text: "פעולות", value: "actions" },
      ],
      rewards: [],
      studyNames: [],
      tableData: [],
      classes: [
        { text: "ט", value: 9 },
        { text: "י", value: 10 },
        { text: 'י"א', value: 11 },
        { text: 'י"ב', value: 12 },
      ],
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
      isExternalRange: [
        {
          text: "חצוני",
          value: true,
        },
        {
          text: "פנימי",
          value: false,
        },
      ],
      isSplitedRange: [
        {
          text: "לא",
          value: false,
        },
        {
          text: "כן",
          value: true,
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
            reformId: el.reformId,
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
        reformId: row.reformId,
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
        this.rewards.push({
          isSplit: el.split,
          students: el.students,
          studyName: currReward.studyName,
          units: currReward.studyUnits,
          reformId: el.reformId,
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
        reformId: 5,
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
    onStudyNameChange(row) {
      row.questionnaire = row.units = "";
      row.hoursReward = row.percentReward = 0;
      row.students = 10;
    },
    onQuestionnairesChange(row) {
      if (
        this.additionalReward.find(
          (el) =>
            el.studyName == row.studyName &&
            el.questionnaire == row.questionnaire
        ) != null
      ) {
        row.units = this.additionalReward.find(
          (el) =>
            el.studyName == row.studyName &&
            el.questionnaire == row.questionnaire
        ).studyUnits;
      }
      this.getHoursReward(row);
    },
    onBagrutTypeChange(row) {
      this.getHoursReward(row);
    },
    onStudentsChange(row) {
      let rewrdsData = this.additionalReward.find(
        (el) => el.recordkey == row.recordkey
      );
      if (parseInt(row.students) > 9) {
        row.hoursReward = rewrdsData.hoursReward;
        row.percentReward = rewrdsData.percentReward;
      } else if (parseInt(row.students) > 5) {
        row.hoursReward = rewrdsData.hoursReward / 2;
        row.percentReward = rewrdsData.percentReward / 2;
      } else {
        row.hoursReward =
          rewrdsData.hoursReward != 1.5 ? rewrdsData.hoursReward / 4 : 0.33;
        row.percentReward = rewrdsData.percentReward / 4;
      }
    },
    onIsSplitChange(row) {
      if (row.isSplit == false) {
        this.getHoursReward(row);
      }
    },
    onHoursRewardChange(row) {
      let temp = this.additionalReward.find(
        (el) =>
          el.studyName == row.studyName &&
          (el.questionnaire == null || el.questionnaire == row.questionnaire) &&
          el.studyUnits == row.units
      );
      if (temp == null) {
        return;
      }
      // check if internal or extrnal hours
      if (row.external) {
        if (parseFloat(row.hoursReward) > temp.externalHoursReward) {
          row.hoursReward = temp.externalHoursReward;
          this.onStudentsChange(row);
        } else {
          row.percentReward =
            temp.percentReward / (temp.externalHoursReward / row.hoursReward);
        }
      } else {
        if (parseFloat(row.hoursReward) > temp.internalHoursReward) {
          row.hoursReward = temp.internalHoursReward;
          this.onStudentsChange(row);
        } else {
          row.percentReward =
            temp.percentReward / (temp.internalHoursReward / row.hoursReward);
        }
      }
    },
    studyName() {
      this.additionalReward.forEach((el) => {
        if (this.studyNames.includes(el.studyName) == false) {
          this.studyNames.push(el.studyName);
        }
      });
    },
    getQuestionnaires(studyName) {
      var temp = [];
      this.additionalReward
        .filter((el) => el.studyName == studyName)
        .forEach((el) => {
          if (
            el.questionnaire != null &&
            temp.includes(el.questionnaire) == false
          ) {
            temp.push(el.questionnaire);
          }
        });
      return temp;
    },
    getHoursReward(row) {
      let temp = this.additionalReward.find(
        (el) =>
          el.studyName == row.studyName &&
          (el.questionnaire == null || el.questionnaire == row.questionnaire) &&
          el.studyUnits == row.units
      );
      if (temp == null) {
        row.hoursReward = 0;
        row.percentReward = 0;
      } else {
        row.hoursReward =
          row.isExternal == true
            ? temp.internalHoursReward
            : temp.externalHoursReward;
        row.percentReward =
          row.isExternal == true
            ? temp.internalPercentReward
            : temp.externalPercentReward;
        row.recordkey = temp.recordkey;
      }
    },
    getUnits(row) {
      let units = Array.from(
        new Set(
          this.additionalReward
            .filter((el) => el.studyName == row.studyName)
            .map((item) => item.studyUnits)
        )
      );
      if (units.length == 1 && units[0] != row.units) {
        row.units = units[0];
        this.getHoursReward(row);
      }
      return units;
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
#rewardsTable {
  margin-bottom: 10%;
  margin-left: 20px;
  margin-right: 20px;
  padding: 15px;
}
.text-xs-right {
  white-space: nowrap;
  /* To help visualize the fact that the container is too small */
  width: 10px;
  /* border: 1px solid #ddd; */
}
</style>