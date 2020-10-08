<template>
  <v-container grid-list-xs>
    <v-data-table
      dense
      :headers="tableHeders"
      :items="tableData"
      :search="search"
      :single-select="singleSelect"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      no-data-text=""
      item-key="empId"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-card-title>
              <v-row>
                <v-col cols="12" md="10">
                  <v-text-field
                    v-model="search"
                    label="Search"
                    placeholder="חפש"
                    single-line
                    autocomplete="off"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-title>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="exportDataToExcel()">ייצא לקסל</v-btn>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      singleSelect: false,
      tableHeders: [],
      tableData: [],
    };
  },
};
</script>

<style scoped>
</style>