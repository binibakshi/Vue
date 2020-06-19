<template>
  <v-card class="overflow-hidden">
    <v-app-bar absolute color="#6A76AB" dark prominent>
      <v-tabs align-with-title>
        <nav>
        <router-link to="/">Home</router-link>
      </nav>
      <nav color="white">
        <router-link to="/about">About</router-link>
      </nav>
      <nav color="white">
        <router-link to="/emp">table</router-link>
      </nav>
     
      </v-tabs>
    </v-app-bar>
    <v-sheet class="overflow-y-auto" max-height="100">
      <v-container style="height: 1000px;"></v-container>
    </v-sheet>
  </v-card>
</template>

<script>
export default {
  name: "myToolBar",
  data: () => ({
    items: [
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me" },
      { title: "Click Me 2" },
    ],
  }),
};
</script>
