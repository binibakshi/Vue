<template>
  <nav>
    <v-toolbar flat>
      <v-toolbar-items class="hidden-sm-and-down">
         <router-link to="/"><v-btn >דף הבית</v-btn></router-link>
         <router-link to="/about"><v-btn >כניסת עובד</v-btn></router-link>
         <router-link to="/emp"><v-btn >פרטי עובד</v-btn></router-link>
        
      </v-toolbar-items>
    </v-toolbar>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped></style>
