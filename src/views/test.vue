<template>
  <!-- <div>
    <table>
      <tr>
        <th v-for="(item, index) in headers" :key="index">{{item.text}}</th>
      </tr>
      <tr v-for="(item, index) in res" :key="index">
        <td>{{ item.fullName }}</td>
        <td>{{ item.med }}</td>
        <td>bla</td>
        <td>{{ item.fullName }}</td>
        <td>
          <v-select
            v-model="item.selected"
            :items="testTable"
            :item-text="(item) => item.name + '-' + item.value"
            item-value="value"
          ></v-select>
        </td>
      </tr>
    </table>
  </div> -->
  <div class="navbar">
    <a href="#home">Home</a>
    <a href="#news">News</a>
    <div class="dropdown">
      <button class="dropbtn">
        Dropdown
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
    </div>
    <v-menu open-on-hover bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> Dropdown </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <router-link to="/empInfo">
            <v-btn>איוש שעות</v-btn>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/empInfo">
            <v-btn>איוש שעות</v-btn>
          </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/empInfo">
            <v-btn>איוש שעות</v-btn>
          </router-link>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>


<script>
export default {
  data() {
    return {
      expanded: [],
      singleExpand: false,
      cSel: "A",
      res: [
        {
          fullName: "name 1",
          med: "med 1",
          startDate: "start  date 1",
          path: ["A", "B", "C", "D"],
          selected: "",
        },
        {
          fullName: "name 2",
          med: "med 22",
          startDate: "start  date 2",
          path: ["A", "B", "C", "D"],
          selected: "",
        },
      ],
      totalRes: 0,
      search: "",
      loading: false,
      options: {
        page: 1,
        itemsPerPage: 40,
      },
      headers: [
        { text: "Name", value: "fullName" },
        { text: "Med", value: "med" },
        { text: "Start Date", value: "startDate" },
        { text: "Create  ", value: "path", width: "200" },
        { text: "selected  ", value: "selected" },
      ],
      testTable: [
        { name: "bini", value: 1 },
        { name: "toto", value: 2 },
        { name: "africa", value: 3 },
      ],
    };
  },
};
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}

.navbar {
  overflow: hidden;
  background-color: #333;
}

.navbar a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}
/* 
.navbar a:hover,
.dropdown:hover .dropbtn {
  background-color: red;
} */

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
