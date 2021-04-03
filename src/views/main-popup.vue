<template>
  <div>
    <v-dialog v-model="this.$store.state.popup" max-width="800px">
      <component :is="popup"
    /></v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      popup: "",
    };
  },
  computed: {
    _popup() {
      return null;
    },
  },
};
</script>

<style scoped>
</style>