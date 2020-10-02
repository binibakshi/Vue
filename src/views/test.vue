<template>
  <div>
    <teserComponent/>
    <mossadHours />
  </div>
</template>


<script>
import mossadHours from "../components/mossadHours";
import teserComponent from "../components/teserComponent";

export default {
  name: "mossadot",
  components: {
    mossadHours,
    teserComponent,
  },
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
