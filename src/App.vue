<template>
  <v-app class="rtl">
    <myNavBar/>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import myNavBar from "./components/my-navbar.vue";
export default {
  name: "App",
  components: {
    myNavBar,
  },
  data: () => ({
    //
  }),
};
</script>

<style>
* {
  direction: rtl;
}
</style>
