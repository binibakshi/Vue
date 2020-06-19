<template>
  <v-app>
    <myToolBar/>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import myToolBar from "./components/my-navbar.vue";
export default {
  name: "App",
  components: {
    myToolBar,
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
