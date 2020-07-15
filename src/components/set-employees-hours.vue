<template>
  <v-card class="wrapper">
    <v-card-title>פרטי עובד</v-card-title>

    <div class="first">
      <v-row>
        <v-col cols="12" md="8">
          <!-- <v-text-field v-model="empId" label="תעודת זהות" required>
          </v-text-field>-->
          <v-card-text>
            <v-autocomplete
              v-model="empId"
              :items="tzArray"
              :search-input.sync="search"
              color="white"
              hide-no-data
              hide-selected
              item-text="empId"
              item-value="empId"
              label="תעודת זהות"
              placeholder="חפש"
            ></v-autocomplete>
          </v-card-text>
          <v-btn @click="getmployeeInfo()" type="submit">חפש</v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="mainBody" v-if="Object.keys(this.employeeInfo).length > 0">
      <div class="second">
        <v-row>
          <v-col cols="12" md="2">
            <p>שם פרטי</p>
            {{ employeeInfo.firstName }}
          </v-col>
          <v-col cols="12" md="2">
            <p>שם משפחה</p>
            {{ employeeInfo.lastName }}
          </v-col>
          <v-col cols="12" md="2">
            <p>גיל</p>
            {{ formatDate }}
          </v-col>
          <v-col cols="12" md="2">
            <p>מין</p>
            {{ formatGender }}
          </v-col>
          <v-col cols="12" md="2">
            <p>משרת אם</p>
            {{ formatIsMother }}
          </v-col>

          <v-col cols="12" md="2">
            <p>שעות גיל</p>
            {{ ageHours }}
          </v-col>
        </v-row>
      </div>
    </div>

    <div v-if="Object.keys(this.existHours).length > 0">
      <table class="center">
        <thead>
          <th>יום</th>
          <th>א</th>
          <th>ב</th>
          <th>ג</th>
          <th>ד</th>
          <th>ה</th>
          <th>ו</th>
          <th>סיכום</th>
        </thead>
        <tbody>
          <td></td>
          <td v-for="(day, index) in existHours" :key="index">{{ day }}</td>
          <td>{{ _totalHours }}</td>
        </tbody>
      </table>
    </div>

    <v-card class="divider" v-if="Object.keys(this.employeeInfo).length > 0">
      <v-card class="right">
        <weeklyHours :empId="empId" :reformType="2"></weeklyHours>
      </v-card>
      <v-card class="left">
        <weeklyHours :empId="empId" :reformType="5"></weeklyHours>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
import axios from "axios";
import weeklyHours from "./weekly-hours.vue";
export default {
  name: "setEmployeesHours",
  components: {
    weeklyHours
  },
  data() {
    return {
      search: null,
      isLoading: false,
      empId: "",
      tzArray: [],
      employeeInfo: {},
      existHours: [],
      weeklyHoursComponents: [],
      ozLetmuraData: []
    };
  },
  created() {
    this.getAllTz();
  },
  computed: {
    _totalHours() {
      if (this.existHours.length > 0) {
        return this.existHours.reduce(
          (acc, item) => parseInt(acc) + parseInt(item),
          0
        );
      } else {
        return 0;
      }
    },
    formatDate() {
      if (this.employeeInfo.birthDate != undefined) {
        // return this.convertDate(this.employeeInfo.birthDate);
        var birthDate = new Date(this.employeeInfo.birthDate);
        var currDate = new Date();
        return currDate.getFullYear() - birthDate.getFullYear();
      } else {
        return undefined;
      }
    },
    formatGender() {
      if (this.employeeInfo.gender != undefined) {
        if (this.employeeInfo.gender === "M") {
          return "זכר";
        } else {
          return "נקבה";
        }
      }
      return undefined;
    },
    formatIsMother() {
      if (this.employeeInfo.mother === true) {
        return "כן";
      } else {
        return "לא";
      }
    },
    ageHours() {
      if (this.employeeInfo.birthDate === undefined) {
        return null;
      }
      var birthDate = new Date(this.employeeInfo.birthDate);
      var currDate = new Date();

      var age = currDate.getFullYear() - birthDate.getFullYear();
      if (age < 50) {
        return 0;
      } else if (age > 55) {
        return 4;
      } else {
        return 2;
      }
    }
  },
  methods: {
    getAllTz() {
      axios
        .get("http://134.122.120.245:8080/ots-app/employees/all")
        .then(response => {
          this.tzArray = response.data;
        })
        .catch(error => this.displayErrorMessage(error));
    },
    getmployeeInfo() {
      axios
        .get("http://134.122.120.245:8080/ots-app/employees/byId", {
          params: {
            empId: this.empId
          }
        })
        .then(response => {
          this.employeeInfo = response.data;
        })
        .catch(error => this.displayErrorMessage(error));
      this.getAllExistHours();
      this.getAllExistData();
    },
    getAllExistHours() {
      axios
        .get(
          "http://134.122.120.245:8080/ots-app/teacherEmploymentDetails/weekSum",
          {
            params: {
              empId: this.empId
            }
          }
        )
        .then(response => {
          this.existHours = response.data;
        })
        .catch(error => this.displayErrorMessage(error));
    },
    removeRow(index) {
      this.weeklyHoursComponents.splice(index, index);
    },
    addNewRow() {
      this.weeklyHoursComponents.push({
        empId: this.empId
      });
    },

    getAllExistData() {
      axios
        .get(
          "http://134.122.120.245:8080/ots-app/teacherEmploymentDetails/byReform",
          {
            params: {
              empId: this.empId,
              mosadId: 2,
              reformType: 5
            }
          }
        )
        .then(response => {
          this.ozLetmuraData = response.data;
        })
        .catch(error => this.displayErrorMessage(error));
    },
    displayErrorMessage(error) {
      if (error.response.data.errorMessage == undefined) {
        console.log(error);
      } else {
        alert(error.response.data.errorMessage);
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  /* border: 1px solid black; */
  overflow: hidden; /* will contain if #first is longer than #second */
}
.first {
  width: 300px;
  float: right; /* add this */
  margin: 5px;
}
.second {
  margin: 5px;
  overflow: hidden; /* if you don't want #second to wrap below #first */
}

.divider {
  width: 98%;
  overflow: hidden;
  margin-top: 30px;
}
.left {
  width: 49%;
  float: left;
  margin: 5px;
}
.right {
  width: 49%;
  float: right;
  margin: 5px;
}
table,
tr,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
tbody {
  display: table-row-group;
  vertical-align: inherit;
  border-block: inherit;
}
thead {
  display: table-header-group;
  vertical-align: inherit;
  border-color: inherit;
}
th {
  font-weight: bold;
}
td,
th {
  margin: 1px;
  padding: 1px;
  width: 25px;
  text-align: center;
}
.center {
  margin: auto;
  width: 50%;
  border: 1x solid burlywood;
  padding: 10px;
}
</style>
