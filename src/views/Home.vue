<script setup>

import { computed } from "vue";
import { useStore } from "vuex";
import { RouterLink } from "vue-router"
import GMapItem from '@/components/GMapItem.vue';

const store = useStore();

// Computed properties to access the authentication state
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const currentUser = computed(() => store.getters.currentUser);
</script>

<template>
  <main>
      <div class="page">
        <div class="content">
          <router-link to="/login">Back to Login Screeeeeen</router-link>
          <router-link to="/moderator/hotspots">Manage Hotspots</router-link>
        </div>
        <div class="map">
          <Suspense>
            <GMapItem />
          </Suspense>
        </div>
      </div>

  <div class="user-status">
        <p v-if="isLoggedIn" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User logged in: {{ currentUser.email }}</p>
        <p v-else class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No user logged in</p>
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
  .map {
    width: 66%;
    height: 100%;
  }
  .page {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }
  a {
    color: black;
  }

</style>