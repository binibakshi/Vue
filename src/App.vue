<template>
  <v-app class="rtl">
    <myNavBar />
    <v-content class="mainBackground">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import myNavBar from "./components/my-navbar.vue";
// import axios from "axios";
export default {
  name: "App",
  components: {
    myNavBar,
  },
  data: () => ({
    //
  }),
  created() {
    this.onStart();
  },
  methods: {
    onStart() {
      // if (this.$store.state.token != null) {
      //   axios.defaults.headers.Authorization =
      //     "Bearer " + this.$store.state.token;
      // }
    },
  },
};
</script>

<style>
* {
  direction: rtl;
  font-family: Verdana;
  font-size: large;
}
.mainBackground {
  background-color: #f2fcfc;
}
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  padding: 2%;
  /* background-color: #d4fafa; */
}
button {
  margin-left: 2%;
  max-height: 30px;
}
.center {
  text-align: center;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}
.v-icon.v-icon {
  margin-right: 4px;
}
</style>
