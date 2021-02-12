<template>
  <v-app class="rtl">
    <myNavBar />
    <v-main class="mainBackground">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import myNavBar from "./components/pageContent/my-navbar";
import axios from "axios";
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
  mounted(){
    console.log("hello wolrd")
      console.log(process.env.NODE_ENV)

  },
  methods: {
    onStart() {
      if (this.$store.state.token != null) {
        axios.defaults.headers.Authorization =
          "Bearer " + this.$store.state.token;
      }
    },
    //   HandleExpiredToken() {
    //     if (this.$store.state.token == null) {
    //       return;
    //     }
    //     axios
    //       .get("/authenticate/isExpired", {
    //         params: {
    //           token: this.$store.state.token,
    //         },
    //       })
    //       .then((response) => {
    //         if (response.data == true) {
    //           this.$store.dispatch("destroyToken");
    //         }
    //       })
    //       .catch(() => {
    //         this.$store.dispatch("destroyToken");
    //       });
    //   },
  },
};
</script>

<style>
* {
  direction: rtl;
  font-family: Assistant, Arial !important;
  /* font-family: Verdana; */
  font-size: medium;
}
.mainBackground {
  background-color: #f2fcfc;
}
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  padding: 2%;
  /* background-color: #d4fafa; */
}
.v-data-footer {
  direction: ltr !important;
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
