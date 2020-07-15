<template>
  <v-card class="wrapper" background-color="#ffffe6">
    <v-card-title primary-title>ניהול מוסדות</v-card-title>

    <v-row>
      <v-col cols="12" md="2">
        <v-autocomplete
          v-model="mossadInfo"
          :items="mossadot"
          color="primary"
          hide-no-data
          hide-selected
          item-text="mossadName"
          item-value="mossadId"
          placeholder="חפש מוסד"
          prepend-icon="mdi-database-search"
          return-object
        ></v-autocomplete>
      </v-col>
    </v-row>

    <v-form class="test" v-if="Object.keys(this.mossadInfo).length > 0">
      <v-row>
        <v-btn fab small @click="isEditing = !isEditing" class="moveLeft">
          <v-icon v-if="isEditing">mdi-close</v-icon>
          <v-icon v-else>mdi-pencil</v-icon>
        </v-btn>
        <v-col cols="12">
          <p>מוסד - {{ mossadInfo.mossadName }}</p>
        </v-col>
      </v-row>
      <v-row>
         <v-col cols="12" md="3">
          <v-text-field
            v-model="mossadInfo.currHours"
            :disabled="true"
            color="white"
            label="שעות במוסד"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="mossadInfo.maxHours"
            :disabled="!isEditing"
            color="indigo accent-1"
            label="מספר שעות מקסימלי"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            :items="mossadTypes"
            v-model="mossadInfo.mossadType"
            item-text="typeName"
            item-value="typeId"
            label="סוג  מוסד"
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!isEditing"
          color="success"
          @click="saveMossadInfo()"
          class="moveRight"
        >שמור</v-btn>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "mosssadotMenagement",

  data() {
    return {
      isEditing: null,
      test: 0,
      isSaved: false,
      mossadInfo: {},
      mossadot: [],
      mossadTypes: []
    };
  },
  created() {
    this.getAllMossadot();
    this.getmossadTypes();
  },
  computed: {
    _mossadotName() {
      return this.mossadot.map(el => el.mossadName);
    }
  },
  methods: {
    getAllMossadot() {
      axios
        .get("http://134.122.120.245:8080/ots-app/mossadot/all")
        .then(response => {
          this.mossadot = response.data;
        })
        .catch(error => this.displayErrorMessage(error));
    },
    getmossadTypes() {
      axios
        .get("http://134.122.120.245:8080/ots-app/mossadType/all")
        .then(response => {
          this.mossadTypes = response.data;
        })
        .catch(error => this.displayErrorMessage(error));
    },
    displayErrorMessage(error) {
      if (error.response.data.errorMessage == undefined) {
        console.log(error);
      } else {
        alert(error.response.data.errorMessage);
      }
    },
    saveMossadInfo() {
      let isSaved = false;
      axios({
        url: "http://134.122.120.245:8080/ots-app/mossadot/save",
        method: "post",
        data: this.mossadInfo
      })
        .then(() => {
          alert("הנתונים נשמרו בהצלחה")
          isSaved = true;
        })
        .catch(error => {
          this.displayErrorMessage(error);
        });
      return isSaved;
    }
  }
};
</script>

<style scoped>
p {
  text-align: center;
  text-decoration: underline;
  font-weight: bold;
}
.wrapper {
  background-color: #ffffe6;
}
.test {
  max-width: 50%;
  margin: 5px;
  padding: 5px;
  border: 1px solid black;
}
.moveLeft {
  margin-right: 15px;
}
.moveRight {
  margin-left: 15px;
}
</style>