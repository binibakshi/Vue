<template>
  <div class="center">
    <h1>ניהול הרשאות</h1>
    <usersMenagment class="center" id="myTable" />
  </div>
</template>

<script>
import usersMenagment from "../auth/users-managment";
import axios from "axios";

export default {
  components: {
    usersMenagment,
  },
  data() {
    return {
      addNew: false,
      usersData: [],
      usersHeaders: [],
    };
  },
  created() {
    this.initilizer();
    this.getAllUsers();
  },
  methods: {
    CreateNew() {
      this.addNew = !this.addNew;
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
    initilizer() {
      this.usersHeaders = [
        { text: "שם פרטי", value: "firstName" },
        { text: "שם משפחה", value: "lastName" },
        { text: "שם משתמש", value: "userName" },
        { text: "סיסמה", value: "password" },
        { text: "הרשאה", value: "mossadId" },
      ];
    },
  },
};
</script>

<style scoped>
#myTable {
  max-width: 60%;
}
</style>