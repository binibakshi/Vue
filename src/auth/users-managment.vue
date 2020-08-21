<template>
  <v-data-table
    :headers="headers"
    :items="usersData"
    :search="search"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>משתמשים</v-toolbar-title>
        <v-card-title>
          <v-text-field
            v-model="search"
            label="Search"
            placeholder="חפש"
            single-line
            autocomplete="off"
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">צור משתמש</v-btn>
          </template>
          <v-card id="myform" class="center wrapper">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.userName"
                      :rules="[rules.required]"
                      label="שם משתמש"
                      autocomplete="off"
                    >שם משתמש</v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.firstName"
                      :rules="[rules.required]"
                      label="שם פרטי"
                      autocomplete="off"
                    >שם משתמש</v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.lastName"
                      :rules="[rules.required]"
                      label="שם משפחה"
                      autocomplete="off"
                    >שם משתמש</v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedUser.password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="סיסמה"
                      hint="לפחות 6 תווים"
                      @click:append="show1 = !show1"
                    >סיסמה</v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="confirmPassword"
                      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="show2 ? 'text' : 'password'"
                      :disabled="editedUser.password == ''"
                      name="input-10-1"
                      label="חזור על סיסמה"
                      hint="לפחות 6 תווים"
                      @click:append="show2 = !show2"
                    >סיסמה</v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      id="autocomlete"
                      label="בחר הרשאה"
                      :items="mossadotList"
                      v-model="editedUser.mossadId"
                      item-text="mossadName"
                      item-value="mossadId"
                      autocomplete
                    ></v-select>
                  </v-col>
                </v-row>
                <v-btn color="info" @click="saveUser()">שמור משתמש</v-btn>
                <v-btn color="red" @click="close()">סגור</v-btn>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <!-- <template v-slot:[x60;item.actions&#x60;]="{ item }"> -->
    <!-- <template v-slot:[`item.actions`]="{ item }"> -->
    <template v-slot:item.mossadId="{ item }">
      <p>{{formatMossadId(item.mossadId)}}</p>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
      <v-icon small @click="logginAsUser(item)">mdi-key</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
export default {
  name: "users-managemet",
  data: () => ({
    dialog: false,
    headers: [
      { text: "שם פרטי", value: "firstName" },
      { text: "שם משפחה", value: "lastName" },
      { text: "שם משתמש", value: "userName" },
      { text: "סיסמה", value: "password" },
      { text: "מוסד", value: "mossadId" },
      { text: "פעולות", value: "actions", sortable: false },
    ],
    usersData: [],
    mossadotList: [],
    editedIndex: -1,
    search: "",
    editedUser: {
      firstname: "",
      lastName: "",
      userName: "",
      password: "",
      mossadId: "",
    },
    defaultUser: {},
    rules: {
      required: (value) => !!value || "שדה חובה",
      min: (v) => v.length >= 6 || "לפחות 6 תווים",
      passwordMatch: (val) =>
        val === this.editedUser.password || "נא להזין סיסמה זהה",
    },
    show1: false,
    show2: false,
    confirmPassword: "",
  }),

  computed: {},

  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.initialize();
    this.getMossadot();
    this.getAllUsers();
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
          this.mossadotList.push({ mossadName: "מנהלה", mossadId: 999 });
        })
        .catch((e) => console.log(e));
    },
    getAllUsers() {
      axios
        .get("/auth/all")
        .then((response) => (this.usersData = response.data))
        .catch((error) => console.log(error));
    },
    editItem(item) {
      this.editedIndex = this.usersData.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialog = true;
    },
    deleteUser(user) {
      const index = this.usersData.indexOf(user);
      if (!confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
        return;
      }
      axios
        .delete("/auth/delete", {
          params: {
            username: user.userName,
          },
        })
        .then(() => {
          alert("המשתמש נמחק בהצלחה");
          this.usersData.splice(index, 1);
        })
        .catch("אירעה תקלה בעת מחיקת משתמש");
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },
    saveUser() {
      let url = "/auth/save";
      if (this.editedIndex > -1) {
        url = "/auth/update";
      }
      if (
        this.editedUser.userName == "" ||
        this.editedUser.password == "" ||
        this.editedUser.mossadId == "" ||
        this.editedUser.firstName == "" ||
        this.editedUser.lastName == ""
      ) {
        alert("נא להזין את כל השדות");
        return;
      }
      if (this.editedUser.password != this.confirmPassword) {
        alert("סיסמאות לא תואמות");
        return;
      }
      if (this.editedUser.password.length < 6) {
        alert("נא להזין סיסמה יותר מ6 תווים");
        return;
      }
      axios
        .post(url, {
          userName: this.editedUser.userName,
          password: this.editedUser.password,
          mossadId: this.editedUser.mossadId,
          firstName: this.editedUser.firstName,
          lastName: this.editedUser.lastName,
        })
        .then(() => {
          alert("המשתמש נשמר בהצלחה");
          if (this.editedIndex > -1) {
            Object.assign(this.usersData[this.editedIndex], this.editedUser);
          } else {
            this.usersData.push(this.editedUser);
          }
          this.confirmPassword = "";
          this.close();
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
    },
    logginAsUser(user) {
      this.$store.state.logginAuth = user.mossadId;
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