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
                      :items="reformTypes"
                      v-model="selectedReformId"
                      label="סוג"
                    ></v-select>
                  </v-col>
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
        <template v-slot:[`item.studyName`]="{ item }">
          <v-autocomplete
            :items="studyNames"
            v-model="item.studyName"
            @change="onStudyNameChange(item)"
            label="מקצוע"
          ></v-autocomplete>
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
export default {
  props: ["empId", "empData", "selectedYear", "additionalReward", "existData"],
  data() {
    return {
      headers: [
        { text: "", value: 0 },
        { text: "", value: 0 },
        { text: "", value: 0 },
        { text: "", value: 0 },
        { text: "", value: 0 },
        { text: "", value: 0 },
        { text: "", value: 0 },
      ],
      jobRewardsTable: [],
    };
  },
};
</script>
<style>
</style>