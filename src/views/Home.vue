<script setup>

import { computed } from "vue";
import { useStore } from "vuex";
import { RouterLink } from "vue-router"

const store = useStore();

// Computed properties to access the authentication state
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const currentUser = computed(() => store.getters.currentUser);
</script>

<template>
  <main>
    <router-link to="/login">Back to Login Screeeeeen</router-link>

  <div class="user-status">
        <p v-if="isLoggedIn">User logged in: {{ currentUser.email }}</p>
        <p v-else>No user logged in</p>
      </div>
  </main>
</template>


<style scoped>
.user-status {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>