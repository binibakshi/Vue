<template>
  <nav>
    <v-toolbar flat>
      <v-toolbar-items>
        <router-link to="/empInfo">
          <v-btn>איוש שעות</v-btn>
        </router-link>
        <router-link to="/calcHours">
          <v-btn>רפורמות עובד</v-btn>
        </router-link>
        <router-link to="/HireEmp">
          <v-btn>עובדים</v-btn>
        </router-link>
        <router-link to="/mossadot">
          <v-btn>ניהול מוסדות</v-btn>
        </router-link>
        <router-link to>
          <v-btn>דוחות</v-btn>
        </router-link>
        <router-link to="/ImportData">
          <v-btn>ניהול Excel</v-btn>
        </router-link>
        <router-link to="/auth">
          <v-btn>הרשאות</v-btn>
        </router-link>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <p>{{_username}}</p>
      <p v-if="_mossadId == 999">(מנהלה)</p>
      <p>{{_mossadName}}</p>
      <v-btn v-if="_isLogged  == true" @click="logout()" color="#6666ff">התנתקות</v-btn>
    </v-toolbar>
    <v-row></v-row>
  </nav>
</template>

<script>
import axios from "axios";
import { bus } from "../main";

export default {
  data() {
    return {
      mossadName: "",
    };
  },
  mounted() {
    bus.$on("changeWeeklyHours", () => this.getMossadInfo());
  },
  computed: {
    _mossadName() {
      if (this.$store.state.mossadInfo != null) {
        return this.$store.state.mossadInfo.mossadName;
      }
      return "";
    },
    _isLogged() {
      if (this.$store.state.token != null) {
        return true;
      }
      return false;
    },
    _mossadId() {
      return this.$store.state.mossadId;
    },
    _username() {
      return this.$store.state.username;
    },
  },
  methods: {
    getMossadInfo() {
      axios
        .get("mossadot/byId", {
          params: {
            mossadId: this.$store.state.logginAuth,
          },
        })
        .then((response) => {
          this.$store.state.mossadInfo = response.data;
          this.$store.commit("setMossadInfo", response.data);
          this.mossadName = response.data.mossadName;
        })
        .catch((error) => console.log(error));
    },
    logout() {
      this.$store.dispatch("destroyToken").then(() => {
        localStorage.removeItem("mossadId");
        this.$router.push({ name: "login" });
      });
    },
  },
};
</script>

<style scoped>
nav {
  padding: 1%;
  background-color: whitesmoke;
}
::v-deep .v-toolbar__content, .v-toolbar__extension {
  background-color: whitesmoke;
}
p {
  margin-left: 10px;
  margin-top: 15px;
  font-weight: bold;
}
</style>
