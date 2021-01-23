<template>
  <div>
    <v-data-table
      id="additionalrewardsTable"
      :headers="header"
      dense
      :items="data"
      :search="search"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      class="elevation-3 center"
    >
      <template v-slot:[`item.external`]="{ item }">{{
        formatIsExternal(item.external)
      }}</template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editRow(item)">mdi-pencil</v-icon>
        <v-icon small @click="removeRow(item)">mdi-delete</v-icon>
        <v-icon small @click="addInitialRow(item)">mdi-content-copy</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: ["structure", "header"],
  data() {
    return {
      search: "",
      data: [],
      newData: [],
    };
  },
  mounted() {
    this.getExistData();
  },
  methods: {
    getExistData() {
      let url = "additionalRewards/all";
      axios
        .get(url)
        .then((response) => {
          this.data = response.data;
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    editRow() {},
    addInitialRow() {
      this.data.push(this.structure);
      this.newData.push(this.structure);
    },
    removeRow() {},
    saveAll() {},
    formatIsExternal(isExternal) {
      if (isExternal) {
        return "פנימי";
      }
      return "חיצוני";
    },
  },
};
</script>

<style scoped>
.center {
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 70%;
}
</style>