<template>
  <v-form class="test">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          :rules="requiredFieldRull"
          v-model="mossadInfo.mossadName"
          color="indigo accent-1"
          label="שם מוסד"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :rules="requiredFieldRull"
          v-model.number="mossadInfo.mossadId"
          color="indigo accent-1"
          label="קוד מוסד"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          :items="mossadTypes"
          v-model="mossadInfo.mossadType"
          item-text="typeName"
          item-value="typeId"
          label="סוג  מוסד"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="mossadInfo.maxHours"
          color="indigo accent-1"
          label="מספר שעות מקסימלי"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="saveMossadInfo()" class="moveRight">שמור</v-btn>
    </v-row>
    <v-btn v-if="mossadInfo.mossadId != undefined" color="error" @click="deleteMossad()">מחק מוסד</v-btn>
  </v-form>
</template>

<script>
import axios from "axios";

export default {
  name: "createMossad",

  data() {
    return {
      mossadInfo: {},
      isEditing: null,
      isSaved: false,
      mossadTypes: [],
      requiredFieldRull: [(v) => !!v || "שדה חובה"],
    };
  },
  created() {
    this.getmossadTypes();
  },
  computed: {
    _mossadInfo() {
      return this.mossadInfo;
    },
  },
  methods: {
    getmossadTypes() {
      axios
        .get("/mossadType/all")
        .then((response) => {
          this.mossadTypes = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    saveMossadInfo() {
      let isSaved = false;
      axios({
        url: "/mossadot/save",
        method: "post",
        data: this.mossadInfo,
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה");
          isSaved = true;
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
        });
      return isSaved;
    },
    deleteMossad() {
      axios
        .delete("/mossadot", {
          params: {
            mossadId: this.mossadInfo.mossadId,
          },
        })
        .then()
        .catch((e) => console.log(e));
    },
  },
};
</script>

<style scoped>
p {
  text-align: center;
  text-decoration: underline;
  font-weight: bold;
}
.test {
  max-width: 80%;
  margin: 5px;
  padding: 5px;
  /* border: 1px solid black; */
}
.moveLeft {
  margin-right: 15px;
}
.moveRight {
  margin-left: 15px;
}
.centerize {
  padding-top: 12px;
  margin-top: 4px;
  display: flex;
}
</style>