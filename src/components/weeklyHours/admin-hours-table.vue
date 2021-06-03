<template>
  <div class="adminHours center">
    <v-text-field
      v-model="hours"
      label="שעות"
      type="number"
      min="0"
      @change="handleHoursChanged()"
    />
    <v-text-field disabled></v-text-field>
    <v-btn color="primary" dense @click="saveHours()">שמור</v-btn>
  </div>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";
export default {
  props: ["empId", "begda", "endda", "existTeacherHours"],
  data() {
    return {
      hours: 0,
    };
  },
  mounted() {
    this.initilize();
  },
  methods: {
    initilize() {
      this.hours = this.existTeacherHours
        .reduce((acc, item) => parseFloat(acc) + parseFloat(item.hours), 0)
        .toFixed(2);
    },
    saveHours() {
      let teacherHours = [
        {
          empId: this.empId,
          mossadId: this.$store.state.logginAs,
          changedBy: this.$store.state.username,
          empCode: 71,
          begda: new Date(this.begda),
          endda: new Date(this.endda),
          hours: parseFloat(this.hours).toFixed(2),
          reformType: 8,
        },
      ];
      // first insert teacher hours(only hours per empCode)
      axios({
        url: "/teacherHours/saveAll",
        method: "post",
        data: teacherHours,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          bus.$emit("changeWeeklyHours");
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    handleHoursChanged() {
      if (this.hours <= 0) {
        this.hours = 0;
      }
    },
  },
};
</script>

<style scoped>
.adminHours {
  max-width: 10rem;
}
</style>