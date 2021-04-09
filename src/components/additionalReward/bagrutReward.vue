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
            <div style="display: inline-flex">
              <v-text-field
                v-model="search"
                label="Search"
                placeholder="חפש"
                single-line
                autocomplete="off"
                hide-details
                append-icon="mdi-magnify"
                class="little-margin"
              ></v-text-field>
              <v-select
                :items="reformTypes"
                v-model="selectedReformId"
                label="סוג"
                class="little-margin"
              ></v-select>
              <v-btn
                class="to-left"
                dense
                color="success"
                @click="exportToExcel()"
                >ייצא לאקסל</v-btn
              >
            </div>
            <v-dialog v-model="dialog" max-width="50%">
              <v-card id="myform" class="center wrapper">
                <h1>פרטים נוספים</h1>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="חלוקת אחוזים"
                          type="number"
                          min="0"
                          max="100"
                          v-model="refToRow.teacherPercent"
                          @change="onPercentChange(refToRow)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="5">
                        <v-text-field
                          label="שם מורה נוסף"
                          v-model="refToRow.secondTeacher"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-btn color="grey" @click="close()">סגור</v-btn>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
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
            :item-text="(i) => i.studyId + ' - ' + i.studyName"
            item-value="studyName"
            @change="onStudyNameChange(item)"
            label="מקצוע"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.units`]="{ item }">
          <v-select
            style="max-width: 50px"
            label='יח"ל'
            v-model="item.units"
            :items="getUnits(item)"
            @input="onUnitsChange(item)"
          ></v-select>
        </template>
        <template v-slot:[`item.actualUnits`]="{ item }">
          <v-select
            style="max-width: 50px"
            label='יח"ל'
            v-model="item.actualUnits"
            :items="getActaulUnits(item)"
            @input="getHoursReward(item)"
          ></v-select>
        </template>
        <template v-slot:[`item.questionnaire`]="{ item }">
          <v-autocomplete
            :items="getQuestionnaires(item.studyName)"
            :disabled="getQuestionnaires(item.studyName).length == 0"
            v-model="item.questionnaire"
            @change="onQuestionnairesChange(item)"
            label="שאלון"
          ></v-autocomplete>
        </template>
        <template v-slot:[`item.isExternal`]="{ item }">
          <v-select
            style="max-width: min-content"
            :items="isExternalRange"
            @change="onBagrutTypeChange(item)"
            v-model="item.isExternal"
            label="סוג"
          ></v-select>
        </template>
        <template v-slot:[`item.grade`]="{ item }">
          <v-select
            style="max-width: 50px"
            :items="grades"
            v-model="item.grade"
            label="שכבה"
          ></v-select>
        </template>
        <template v-slot:[`item.teachingClass`]="{ item }">
          <v-text-field
            style="max-width: 40px"
            v-model="item.teachingClass"
            label="כיתה"
            type="number"
            min="1"
          ></v-text-field>
        </template>
        <template v-slot:[`item.students`]="{ item }">
          <v-text-field
            style="max-width: 40px"
            label="תלמידים"
            v-model="item.students"
            type="number"
            min="1"
            @input="onStudentsChange(item)"
          ></v-text-field>
        </template>
        <template v-slot:[`item.isSplit`]="{ item }">
          <div style="display: inline-flex">
            <v-select
              style="max-width: 50px"
              :items="isSplitedRange"
              v-model="item.isSplit"
              label="מורה נוסף"
              @change="onIsSplitChange(item)"
            ></v-select>

            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon
                  style="min-width: 30px"
                  size="16"
                  v-bind="attrs"
                  v-on="on"
                  @click="openMoreInfo(item)"
                  :disabled="item.isSplit == false"
                  >mdi-information-outline</v-icon
                >
              </template>
              <span>פרטים נוספים</span>
            </v-tooltip>
          </div>
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
        { text: 'יח"ל בפועל', value: "actualUnits" },
        { text: "שאלון", value: "questionnaire" },
        { text: "סוג", value: "isExternal" },
        { text: "שכבה", value: "grade" },
        { text: "כיתה", value: "teachingClass" },
        { text: "תלמידים", value: "students" },
        { text: "מורה נוסף", value: "isSplit" },
        { text: "גמול שעות", value: "hoursReward" },
        { text: "גמול אחוזים", value: "percentReward" },
        { text: "פעולות", value: "actions" },
      ],
      selectedReformId: 5,
      dialog: false,
      refToRow: {},
      rewards: [],
      studyNames: [],
      tableData: [],
      grades: [
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
            reformId: this.selectedReformId,
            year: this.selectedYear,
            employmentCode: this.selectedReformId == 5 ? 9671 : 2598,
            split: el.isSplit,
            actualUnits: el.actualUnits,
            external: el.isExternal,
            students: el.students,
            hours: el.hoursReward,
            percent: el.percentReward,
            grade: el.grade,
            teachingClass: el.teachingClass,
            rewardType: 1,
            secondTeacher: el.secondTeacher,
            teacherPercent: el.teacherPercent,
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
        let currRow = {
          isSplit: el.split,
          students: el.students,
          studyName: currReward.studyName,
          units: currReward.studyUnits,
          actualUnits: el.actualUnits,
          reformId: this.selectedReformId,
          questionnaire: currReward.questionnaire,
          isExternal: el.external,
          hoursReward: el.hours,
          percentReward: el.percent,
          recordkey: el.rewardId,
          grade: el.grade,
          teachingClass: el.teachingClass,
          secondTeacher: el.secondTeacher,
          teacherPercent: el.teacherPercent,
        };
        this.rewards.push(currRow);
      });
    },
    addNewRow() {
      this.rewards.push({
        isExternal: true,
        grade: 9,
        teachingClass: 1,
        studyName: null,
        questionnaire: "",
        isSplit: false,
        units: 0,
        actualUnits: 0,
        students: 0,
        hoursReward: 0,
        percentReward: 0,
        recordkey: null,
        secondTeacher: "",
        percent: 100,
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
            grade: row.grade,
            rewardType: 1,
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
      if (!row.studyName) {
        row.studyName = this.additionalReward.find(
          (el) => el.questionnaire == row.questionnaire
        ).studyName;
      }
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
      let rewardsData = this.additionalReward.find(
        (el) => el.recordkey == row.recordkey
      );
      // handle external and internal diffrently (could be done by add some variable but i find it more complex)
      if (row.isExternal) {
        if (parseInt(row.students) > 9) {
          row.hoursReward = rewardsData.externalHoursReward;
          row.percentReward = rewardsData.externalPercentReward;
        } else if (parseInt(row.students) > 5) {
          row.hoursReward = rewardsData.externalHoursReward / 2;
          row.percentReward = rewardsData.externalPercentReward / 2;
        } else {
          row.hoursReward =
            rewardsData.externalHoursReward != 1.5
              ? rewardsData.externalHoursReward / 4
              : 0.33;
          row.percentReward = rewardsData.externalPercentReward / 4;
        }
      } else {
        if (parseInt(row.students) > 9) {
          row.hoursReward = rewardsData.internalHoursReward;
          row.percentReward = rewardsData.internalPercentReward;
        } else if (parseInt(row.students) > 5) {
          row.hoursReward = rewardsData.internalHoursReward / 2;
          row.percentReward = rewardsData.internalPercentReward / 2;
        } else {
          row.hoursReward =
            rewardsData.internalHoursReward != 1.5
              ? rewardsData.internalHoursReward / 4
              : 0.33;
          row.percentReward = rewardsData.internalPercentReward / 4;
        }
      }
      this.setActualUnits(row);
    },
    onUnitsChange(row) {
      row.actualUnits = row.units;
      this.getHoursReward(row);
    },
    onIsSplitChange(row) {
      if (row.isSplit == false) {
        row.teacherPercent = 100;
        this.onPercentChange(row);
      }
    },
    onPercentChange(row) {
      row.hoursReward = (
        (row.teacherPercent / 100) *
        this.getMaxHours(row)
      ).toFixed(2);
      row.percentReward = (
        (row.teacherPercent / 100) *
        this.getMaxPercents(row)
      ).toFixed(2);
    },
    getMaxHours(row) {
      let currReward = this.additionalReward.find(
        (el) => el.recordkey == row.recordkey
      );
      let maxHours = row.isExternal
        ? currReward.externalHoursReward
        : currReward.internalHoursReward;
      maxHours = (row.actualUnits / row.units) * maxHours;

      if (row.students > 9) {
        //do nothing
      } else if (row.students > 5) {
        maxHours = maxHours / 2;
      } else {
        maxHours = maxHours != 1.5 ? maxHours / 4 : 0.33;
      }
      return maxHours.toFixed(2);
    },
    getMaxPercents(row) {
      let currReward = this.additionalReward.find(
        (el) => el.recordkey == row.recordkey
      );
      let maxPercent = row.isExternal
        ? currReward.externalPercentReward
        : currReward.internalPercentReward;
      maxPercent = (row.actualUnits / row.units) * maxPercent;

      if (row.students > 9) {
        //do nothing
      } else if (row.students > 5) {
        maxPercent = maxPercent / 2;
      } else {
        maxPercent / 4;
      }
      return maxPercent.toFixed(2);
    },
    studyName() {
      this.additionalReward.forEach((el) => {
        if (this.studyNames.includes(el.studyName) == false) {
          this.studyNames.push({
            studyName: el.studyName,
            studyId: el.studyId,
          });
        }
      });
    },
    getQuestionnaires(studyName) {
      var temp = [];
      this.additionalReward
        .filter((el) => el.studyName == studyName || !studyName)
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
          row.isExternal == false
            ? temp.internalHoursReward
            : temp.externalHoursReward;
        row.percentReward =
          row.isExternal == false
            ? temp.internalPercentReward
            : temp.externalPercentReward;
        row.recordkey = temp.recordkey;
      }
      this.setActualUnits(row);
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
        this.onUnitsChange(row);
      }
      return units;
    },
    getActaulUnits(row) {
      if (!row.units) {
        return;
      }
      let units = [];
      let max = this.additionalReward
        .filter((el) => el.studyName == row.studyName)
        .reduce((prev, current) =>
          prev.studyUnits > current.studyUnits ? prev : current
        ).studyUnits;
      for (let index = 1; index <= max; index++) {
        units.push(index);
      }
      return units;
    },
    setActualUnits(row) {
      // get the relative actualUnits
      row.hoursReward = (
        (row.teacherPercent / 100) *
        this.getMaxHours(row)
      ).toFixed(2);
      row.percentReward =
        (row.teacherPercent / 100) * this.getMaxPercents(row).toFixed(2);
    },
    exportToExcel() {
      var excelHeaders = {
        empId: "תעודת זהות",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        mossadName: "שם מוסד",
        year: "שנה",
        studyId: "קוד מקצוע",
        studyName: "מקצוע",
        questionnaire: "שאלון",
        studyUnits: 'יח"ל',
        actualUnits: 'יח"ל בפועל',
        grade: "שכבה",
        teachingClass: "כיתה",
        external: "סוג",
        split: "מפוצל",
        students: "תלמידים",
        hoursReward: "גמול שעות",
        percentReward: "גמול אחוזים",
        secondTeacher: "מורה נוסף",
      };
      var excelData = [];
      this.rewards.forEach((el) => {
        excelData.push({
          empId: this.empId,
          firstName: this.empData.firstName,
          lastName: this.empData.lastName,
          mossadName: this.$store.state.mossadInfo.mossadName,
          year: this.selectedYear,
          studyId: this.additionalReward.find(
            (e) => e.recordkey == el.recordkey
          ).studyId,
          studyName: el.studyName,
          questionnaire: el.questionnaire,
          studyUnits: el.units,
          external: this.isExternalRange.find((e) => e.value == el.isExternal)
            .text,
          grade: this.grades.find((e) => e.value == el.grade).text,
          teachingClass: el.teachingClass,
          split: this.isSplitedRange.find((e) => e.value == el.isSplit).text,
          actualUnits: el.actualUnits,
          students: el.students,
          hoursReward: el.hoursReward,
          percentReward: el.percentReward,
          secondTeacher: el.secondTeacher,
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
    openMoreInfo(row) {
      this.refToRow = row;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
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
.little-margin {
  margin-left: 15px;
}
.to-left {
  position: absolute;
  left: 0px;
}
</style>