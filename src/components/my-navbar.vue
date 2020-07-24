<template>
  <nav>
    <v-toolbar flat>
      <v-toolbar-items class="hidden-sm-and-down">
        <!-- <router-link to="/"><v-btn >דף הבית</v-btn></router-link> -->
        <router-link to="/empInfo">
          <v-btn>איוש שעות</v-btn>
        </router-link>
        <router-link to="/mossadot">
          <v-btn>ניהול מוסדות</v-btn>
        </router-link>
        <router-link to="/ImportData">
          <v-btn>ניהול Excel</v-btn>
        </router-link>
        <!-- <router-link v-if="_mossad != null" to="/mossadot">
          <v-btn>{{_mossad}}</v-btn>
        </router-link> -->
      </v-toolbar-items>
    </v-toolbar>
  </nav>
</template>

<script>
export default {
  computed: {
    _mossad() {
      return this.$store.state.mossadId;
    },
  },
};
</script>

<style scoped></style>
