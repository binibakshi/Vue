<template>
  <nav>
    <v-tabs class="grey lighten-3">
      <v-tab to="/empInfo"> איוש שעות </v-tab>
      <v-tab to="/AdditionalRewards">גמולים</v-tab>
      <v-tab to="/calcHours"> רפורמות עובד </v-tab>
      <v-tab to="/HireEmp"> עובדים </v-tab>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text class="align-self-center mr-4" v-bind="attrs" v-on="on">
            דוחות
            <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/reportWeeklyHours">איוש שעות</v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="align-self-center mr-4"
            style="magin: 0"
            v-bind="attrs"
            v-on="on"
          >
            מנהלה
            <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/auth"> הרשאות </v-list-item>
          <v-list-item to="/ImportData"> ניהול Excel </v-list-item>
          <v-list-item to="/mossadot">ניהול מוסדות </v-list-item>
          <v-list-item to="/mossadotHours"> מגבלת שעות למוסד </v-list-item>
        </v-list>
      </v-menu>
      <div id="navbarInfo" class="parent">
        <p class="child inline-block-child">{{ _username }}</p>
        <p v-if="_mossadId == 999" class="child inline-block-child">(מנהלה)</p>
        <p class="child inline-block-child">{{ _mossadName }}</p>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              large
              @click="logout()"
              v-bind="attrs"
              v-on="on"
              class="child inline-block-child"
              color="primary"
              >mdi-arrow-left-bold-circle</v-icon
            >
          </template>
          <span>התנתק</span>
        </v-tooltip>
      </div>
    </v-tabs>
  </nav>
</template>

<script>
import axios from "axios";
import { bus } from "../../main";

export default {
  data() {
    return {
      mossadName: "",
    };
  },
  created() {
    this.test();
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
    test() {
      if (this.$store.state.logginAs != null) {
        this.$store.dispatch("getMossadInfo");
      }
    },
    getMossadInfo() {
      axios
        .get("mossadot/byId", {
          params: {
            mossadId: this.$store.state.logginAs,
          },
        })
        .then((response) => {
          this.$store.state.mossadInfo = response.data;
          this.$store.commit("setMossadInfo", response.data);
          this.mossadName = response.data.mossadName;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    logout() {
      this.$store.dispatch("destroyToken").then(() => {
        localStorage.removeItem("mossadId");
      });
    },
    isAdmin() {
      if (this.$store.state.mossadId == 999) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
nav {
  padding: 1%;
  background-color: whitesmoke;
}
::v-deep .v-toolbar__content,
.v-toolbar__extension {
  background-color: whitesmoke;
}
p {
  margin-left: 10px;
  margin-top: 15px;
  color: black;
  font-weight: bold;
}

.v-btn:not(.v-btn--round).v-size--default {
  max-height: 30px;
  margin: 0;
  padding: 0;
}

.inline-block-child {
  display: inline-block;
}

#navbarInfo {
  position: absolute;
  left: 20px;
}
</style>
