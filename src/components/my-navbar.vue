<template>
  <nav>
    <v-toolbar flat>
      <v-toolbar-items class="hidden-sm-and-down">
         <!-- <router-link to="/"><v-btn >דף הבית</v-btn></router-link> -->
         <router-link to="/empInfo"><v-btn >פרטי עובד</v-btn></router-link>        
         <router-link to="/mossadot"><v-btn >ניהול מוסדות</v-btn></router-link>        
      </v-toolbar-items>
    </v-toolbar>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped></style>
