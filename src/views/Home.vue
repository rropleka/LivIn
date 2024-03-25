<script setup>

import { computed } from "vue";
import { useStore } from "vuex";
import { RouterLink } from "vue-router"
import GMapItem from '@/components/GMapItem.vue';
import listings from '@/views/Listings.vue';


const store = useStore();

// Computed properties to access the authentication state
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const currentUser = computed(() => store.getters.currentUser);
</script>

<script>
   export default {
      methods: {
         filterByCurrentLocationButton() {
          this.$refs.GMapItem.filterByCurrentLocation();
         }
      }
   }
</script>

<template>
  <main>
      <div class="page">
        <div class="content">
          <router-link to="/login">Back to Login Screeeeeen</router-link>
          <router-link to="/moderator/hotspots">Manage Hotspots</router-link>
          <router-link to="/favorites">Manage Favorites</router-link>
          <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="filterByCurrentLocationButton()">Filter by Current Location</button>
          <div class="propertiesTable">
            <listings></listings>
          </div>
        </div>
        <div class="map">
          <Suspense>
            <GMapItem ref="GMapItem" />
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
  .propertiesTable {
    border: black 1px solid;
    margin-left: 0px;
    width: 100%;
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