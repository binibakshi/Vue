<template>
  <div>
    <v-row>
      <v-col cols="12" md="3">
        <v-autocomplete
          :items="mossadotList"
          v-model="selctedMossad"
          :item-text="mossadName"
          item-value="mossadId"
          label="בחר מוסד להתחברות"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn>test</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "users-managemet",
  data() {
    return {
      usersData: [],
      mossadotList: [],
      selctedMossad: {},
      search: "",
    };
  },
  created() {
    this.getMossadot();
    this.getAllUsers();
  },
  mounted() {
    this.initialize();
  },
  methods: {
    formatMossadId(mossadId) {
      if (this.mossadotList.find((el) => el.mossadId == mossadId) == null) {
        return "";
      }
      return this.mossadotList.find((el) => el.mossadId == mossadId).mossadName;
    },
    initialize() {
      this.defaultUser = {
        firstname: "",
        lastName: "",
        userName: "",
        password: "",
        mossadId: "",
      };
    },
    getMossadot() {
      axios
        .get("mossadot/all")
        .then((response) => {
          this.mossadotList = response.data;
          this.mossadotList.push(
            { mossadName: "מנהלה", mossadId: 999 },
            { mossadName: "חשבות שכר", mossadId: 998 }
          );
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    getAllUsers() {
      axios
        .get("/auth/all")
        .then((response) => (this.usersData = response.data))
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },
    logginAsUser(user) {
      this.$store.state.logginAs = user.mossadId;
      this.$store.dispatch("getMossadInfo");
    },
  },
};
</script>

<style scoped>
::v-deep .v-input__slot {
  direction: ltr;
}
::v-deep .v-input input {
  direction: ltr;
}
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  background-color: initial;
}
#autocomlete {
  max-width: 150px;
  max-height: 25px;
  padding-top: 0;
}
p {
  font-weight: bold;
  font-size: large;
}
span {
  font-size: 20px;
}
</style>