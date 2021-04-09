<template>
  <div ref="document">
    <v-data-table
      id="employeeTable"
      :headers="headers"
      :items="employeesData"
      :search="search"
      :footer-props="{
        'items-per-page-options': [20, 50, 100, -1],
        'items-per-page-text': 'מספר תוצאות  :',
      }"
      class="elevation-3"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-card-title>
              <v-text-field
                v-model="search"
                label="Search"
                placeholder="חפש"
                single-line
                autocomplete="off"
                hide-details
                append-icon="mdi-magnify"
              ></v-text-field>
            </v-card-title>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="50%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="() => (createNew = true)"
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                >צור עובד</v-btn
              >
            </template>
            <v-card id="myform" class="center wrapper">
              <h1>פרטי עובד</h1>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="editedEmployee.empId"
                        label="תעודת זהות"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="editedEmployee.firstName"
                        :rules="nameRules"
                        label="שם פרטי"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="editedEmployee.lastName"
                        :rules="nameRules"
                        label="שם משפחה"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="2">
                      <p>מין</p>
                      <v-radio-group
                        v-model="editedEmployee.gender"
                        :mandatory="false"
                      >
                        <v-radio label="זכר" value="M"></v-radio>
                        <v-radio label="נקבה" value="F"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12" md="2">
                      <p>משרת אם</p>
                      <v-radio-group
                        v-model="editedEmployee.mother"
                        :mandatory="false"
                      >
                        <v-radio label="כן" value="true"></v-radio>
                        <v-radio label="לא" value="false"></v-radio>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12" md="3">
                      <label for="birthDate">תאריך לידה</label>
                      <input
                        type="date"
                        name="birthDate"
                        v-model="editedEmployee.birthDate"
                      />
                    </v-col>
                  </v-row>
                  <v-btn color="primary" @click="saveEmployee()"
                    >שמור עובד</v-btn
                  >
                  <v-btn color="grey" @click="close()">סגור</v-btn>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.birthDate`]="{ item }">{{
        FormatDate2(item.birthDate)
      }}</template>
      <template v-slot:[`item.ageHours`]="{ item }">{{
        _getAgeHours(item.birthDate)
      }}</template>
      <template v-slot:[`item.mother`]="{ item }">{{
        formatMother(item.mother)
      }}</template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon
          v-show="$store.state.mossadId == 999"
          small
          @click="deleteEmployer(item)"
          >mdi-delete</v-icon
        >
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HireEmployee",
  data() {
    return {
      employeesData: [],
      dialog: false,
      validForm: true,
      createNew: false,
      editedIndex: -1,
      search: "",
      idRules: [
        (v) => !!v || "שדה חובה",
        (v) => v.length == 9 || "בתעודת זהות נדרש 9 ספרות",
      ],
      nameRules: [(v) => !!v || "שדה חובה"],
      rules: {
        required: (value) => !!value || "שדה חובה",
      },
      empId: null,
      headers: [
        { text: "תעודת זהות", value: "empId" },
        { text: "שם משפחה", value: "lastName" },
        { text: "שם פרטי", value: "firstName" },
        { text: "גיל", value: "birthDate" },
        { text: "מורה אם", value: "mother" },
        { text: "שעות גיל", value: "ageHours" },
        { text: "פעולות", value: "actions", sortable: false },
      ],
      editedEmployee: {
        empId: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        mother: "",
        ageHours: "",
      },
      defaultEmployee: {
        empId: "",
        lastName: "",
        userName: "",
        birthDate: "",
        mother: "",
        ageHours: "",
      },
    };
  },
  created() {
    this.getAllTz();
  },
  methods: {
    FormatDate(iDate) {
      var inputDate = new Date(iDate);
      var formattedDate;
      var year = inputDate.getFullYear();
      var month = 0;
      var day = 0;

      month += inputDate.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      if (inputDate.getDate() < 10) {
        day = "0";
      }
      day += inputDate.getDate();
      formattedDate = year + "-" + month + "-" + day;
      return formattedDate;
    },
    FormatDate2(iDate) {
      var currDate = new Date();
      var newdate = new Date(iDate);
      var tempYears = currDate.getFullYear() - newdate.getFullYear();
      if (currDate.getUTCMonth() < newdate.getUTCMonth()) {
        tempYears -= 1;
      }

      var tempMonth = currDate.getUTCMonth() - newdate.getUTCMonth();

      if (tempMonth < 0) {
        tempMonth = 12 + tempMonth;
      }
      if (tempMonth < 10) {
        tempMonth = "0" + tempMonth;
      }
      return tempYears + "." + tempMonth;
    },
    formatMother(mother) {
      if (mother) {
        return "כן";
      }
      return "לא";
    },
    setEmployeeInfo(employee) {
      this.editedEmployee = employee;
      this.editedEmployee.mother = "" + this.editedEmployee.mother + "";
      this.editedEmployee.birthDate = this.FormatDate(
        new Date(this.editedEmployee.birthDate)
      );
    },
    saveEmployee() {
      if (
        this.editedEmployee.empId == null ||
        this.editedEmployee.firstName == null ||
        this.editedEmployee.lastName == null ||
        this.editedEmployee.birthDate == null ||
        this.editedEmployee.gender == null ||
        this.editedEmployee.mother == null
      ) {
        alert("נא להזין את כל השדות");
        return;
      }
      if (
        this.createNew == true &&
        this.employeesData.some(
          (el) => el.empId == this.editedEmployee.empId
        ) &&
        !confirm("קיים עובד עם תעודת זהות זו האם אתה בטוח שברצונך להמשיך ?")
      ) {
        this.close();
        return;
      }
      axios
        .post(`/employees/save`, {
          empId: this.editedEmployee.empId,
          firstName: this.editedEmployee.firstName,
          lastName: this.editedEmployee.lastName,
          birthDate: this.editedEmployee.birthDate,
          gender: this.editedEmployee.gender,
          mother: this.editedEmployee.mother,
        })
        .then(() => {
          this.getAllTz();
          alert("פרטי העובד נשמרו בהצלחה");
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
      this.close();
    },
    getAllTz() {
      axios
        .get("/employees/all")
        .then((response) => {
          this.employeesData = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    deleteEmployer(employee) {
      const index = this.employeesData.indexOf(employee);
      if (!confirm("האם אתה בטוח שברצונך למחוק עובד זה?")) {
        return;
      }
      axios
        .delete("/employees/byId", {
          params: {
            empId: employee.empId,
          },
        })
        .then(() => {
          alert("העובד נמחק בהצלחה");
          this.employeesData.splice(index, 1);
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    editItem(item) {
      this.editedIndex = this.employeesData.indexOf(item);
      this.setEmployeeInfo(item);
      this.dialog = true;
      this.createNew = false;
    },
    _getAgeHours(date) {
      var birthDate = new Date(date);
      var today = new Date();
      var currSchoolYear = new Date(today.getFullYear(), 8, 1);

      if (today.getUTCMonth() > 8) {
        currSchoolYear.setFullYear(currSchoolYear.getFullYear() + 1);
      }

      var age = currSchoolYear.getFullYear() - birthDate.getFullYear();
      if (age < 50) {
        return 0;
      } else if (age > 55) {
        return 4;
      } else {
        return 2;
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedEmployee = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  padding: 3%;
}
input {
  border: 1px solid;
}
.header {
  justify-content: center;
  font-weight: bold;
  text-decoration: underline;
}

#searchEmployee {
  max-width: 400px;
}
#employeeTable {
  margin-bottom: 3%;
}
#myform {
  background-color: #ffffe6;
}
.v-card > *:first-child:not(.v-btn):not(.v-chip) {
  background-color: initial;
}
</style>
