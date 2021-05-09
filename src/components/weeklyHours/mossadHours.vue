<template>
  <div class="mossadInfoGrid">
    <div>
      <p>מוסד - {{ mossadInfo.mossadName }}</p>
    </div>
    <div class="mossadInfoGridItem">
      <a @click="navToReport()"
        >ש"ש פרונטלי מאויש - {{ mossadInfo.currHours }}</a
      >
    </div>
    <div class="mossadInfoGridItem">
      <p>
        יתרת שעות -
        {{ getTwoDigits(mossadInfo.maxHours - mossadInfo.currHours) }}
      </p>
    </div>
    <div class="mossadInfoGridItem">
      <p>מגבלת שעות- {{ mossadInfo.maxHours }}</p>
    </div>
    <div class="mossadInfoGridItem">
      <p>
        אחוז איוש -
        {{ getTwoDigits((mossadInfo.currHours / mossadInfo.maxHours) * 100) }}%
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mossadInfo"],
  data() {
    return {};
  },
  methods: {
    getTwoDigits(number) {
      if (isNaN(number)) {
        return "";
      }
      return parseFloat(number).toFixed(2);
    },
    navToReport() {
      let routeData = this.$router.resolve({
        path: "/report/reportWeeklyHours",
      });
      window.open(routeData.href);
    },
  },
};
</script>

<style scoped>
p {
  font-weight: bold;
}
.mossadInfoGrid {
  margin-right: 0.7em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}
.mossadInfoGridItem {
  margin-right: 0.7em;
  margin-left: 0.7em;
}
</style>