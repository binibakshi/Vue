<template>
  <v-card>
    <v-form v-model="validForm" autocomplete="off">
      <v-card-title>קליטת עובד</v-card-title>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="empInfo.id"
            label="תעודת זהות"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="empInfo.firstName"
            :rules="nameRules"
            label="שם פרטי"
            required
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            v-model="empInfo.lastName"
            :rules="nameRules"
            label="שם משפחה"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <p>מין</p>
          <v-radio-group v-model="empInfo.gender" :mandatory="false">
            <v-radio label="זכר" value="M"></v-radio>
            <v-radio label="נקבה" value="F"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" md="2" v-show="empInfo.gender === 'F'">
          <p>משרת אם</p>
          <v-radio-group v-model="empInfo.mother" :mandatory="false">
            <v-radio label="כן" value="true"></v-radio>
            <v-radio label="לא" value="false"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" md="3">
          <label for="birthDate">תאריך לידה </label>
          <input type="date" name="birthDate" v-model="empInfo.birthDate" />
        </v-col>
      </v-row>
      <v-row>
        <v-btn
          type="submit"
          :disabled="!validForm"
          class="mr-4"
          @click="validate"
        >
          אישור טופס</v-btn
        >
      </v-row>
    </v-form>
    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-text>
            העובד נשמר בהצלחה
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "HireEmployee",

  data() {
    return {
      dialog: false,
      validForm: true,
      idRules: [
        (v) => !!v || "שדה חובה",
        (v) => v.length == 9 || "בתעודת זהות נדרש 9 ספרות",
      ],
      nameRules: [(v) => !!v || "שדה חובה"],
      gender: "",
      empInfo: {
        id: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        mother: false,
      },
    };
  },
  methods: {
    validate() {
      console.log(this.dialog);
      if (this.insertRecord()) {
        this.dialog = true;
      }
    },
    insertRecord() {
      var isSaved = false;
      axios
        .post(`http://134.122.120.245:8080/ots-app/employees/save`, {
          id: this.empInfo.id,
          firstName: this.empInfo.firstName,
          lastName: this.empInfo.lastName,
          birthDate: this.empInfo.birthDate,
          begda: new Date(),
          gender: this.empInfo.gender,
          mother: this.empInfo.mother,
        })
        .then((response) => {
          console.log(response.data);
          isSaved = true
        })
        .catch((e) => {
          console.log(e);
        });
      return isSaved;
    },
  },
};
</script>

<style scoped>
input {
  border: 1px solid;
}
</style>
