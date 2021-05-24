<template>
  <nav>
    <v-tabs class="grey lighten-3 navBar">
      <v-tab to="/empInfo"> איוש שעות </v-tab>
      <v-menu left offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            class="align-self-center mr-4"
            style="magin: 0"
            v-bind="attrs"
            v-on="on"
          >
            גמולים <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/AdditionalRewards">גמולי בגרות</v-list-item>
        </v-list>
        <v-list>
          <v-list-item to="/jobRewards">גמולי תפקיד</v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text class="align-self-center mr-4" v-bind="attrs" v-on="on">
            דוחות
            <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list v-for="report in reports" v-bind:key="report.url">
          <v-list-item :to="`${report.url}`">{{
            report.text
          }}</v-list-item></v-list
        >
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text class="align-self-center mr-4" v-bind="attrs" v-on="on">
            ניהול אקסלים
            <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/importExcels">אקסלים לקליטה</v-list-item>
        </v-list>
        <v-list>
          <v-list-item to="/exportExcels">אקסלים לייצוא</v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text class="align-self-center mr-4" v-bind="attrs" v-on="on">
            נוספים
            <v-icon right> mdi-menu-down </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/HireEmp"> עובדים</v-list-item>
        </v-list>
        <v-list>
          <v-list-item to="/setJobPercent">אחוז קביעות משרה</v-list-item>
        </v-list>
        <v-list>
          <v-list-item to="/calcHours"> רפורמות עובד </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y v-if="$store.state.mossadId == 999">
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
          <v-list-item to="/auth" v-if="$store.state.mossadId == 999">
            הרשאות
          </v-list-item>
          <v-list-item to="/mossadot">ניהול מוסדות </v-list-item>
          <v-list-item to="/mossadotHours"> מגבלת שעות למוסד </v-list-item>
          <v-list-item to="/mossadClasses">ניהול כיתות במוסד</v-list-item>
          <v-menu left offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                class="align-self-center mr-4"
                style="magin: 0"
                v-bind="attrs"
                v-on="on"
              >
                עריכת טבלאות נתונים <v-icon right> mdi-menu-left </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item to="/bagrutRewardsCust">גמולי בגרות</v-list-item>
              <v-list-item to="/jobRewardsCust">גמולי תפקיד</v-list-item>
            </v-list>
          </v-menu>
        </v-list>
      </v-menu>
      <div class="loginInfo">
        <div>
          <p class="child inline-block-child">{{ _username }}</p>
        </div>
        <div>
          <p class="child inline-block-child">{{ _AuthText }}</p>
        </div>
        <div>
          <p class="child inline-block-child">{{ _mossadName }}</p>
        </div>
        <div>
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
      reports: [
        { text: "איוש שעות", url: "/report/reportWeeklyHours" },
        { text: "גמולי בגרות", url: "/report/reportBagrutRewards" },
        { text: "גמולי תפקיד", url: "/report/reportJobRewards" },
        { text: "דוח פערי שעות-גמולים", url: "/report/reportRewardGaps" },
        { text: "דוח פערי אחוזי משרה", url: "/report/reportJobPercentGaps" },
        {
          text: "דוח פערי שעות שבועיות",
          url: "/report/reportTeacherHoursGaps",
        },
      ],
    };
  },
  mounted() {
    if (this.$store.state.logginAs != null) {
      this.$store.dispatch("getMossadInfo");
    }
    bus.$on("changeWeeklyHours", () => this.getMossadInfo());
  },
  computed: {
    _mossadName() {
      if (this.$store.state.mossadInfo != null) {
        return this.$store.state.mossadInfo.mossadName;
      }
      return "";
    },
    _AuthText() {
      if (this.$store.state.mossadId == 999) {
        return "(Adimn)";
      } else if (this.$store.state.mossadId == 998) {
        return "(חשבות שכר)";
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
  color: black;
}

.v-btn:not(.v-btn--round).v-size--default {
  max-height: 30px;
  margin: 0;
  padding: 0;
}
.loginInfo {
  display: inline-flex;
  position: absolute;
  left: 20px;
}
.loginInfo > div {
  margin: 1rem;
}
</style>
