<script setup lang="ts">


import { computed, defineComponent, } from "vue";
import { useStore } from "vuex";
import { RouterLink } from "vue-router"
import GMapItem from '@/components/GMapItem.vue';
import listings from '@/views/Listings.vue';
import { getFirestore, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../firebaseInit'

const store = useStore();

// Computed properties to access the authentication state
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const currentUser = computed(() => store.getters.currentUser);

let currentUser1 = ""
if (store.getters.currentUser) {
    currentUser1 = store.getters.currentUser.email;
}
const db = getFirestore(firebaseapp);
const favoritesSnapshot = await getDocs(query(collection(db, 'favorites'), where('user', '==', currentUser1)));
let favorites: Array<object> = [];
favoritesSnapshot.forEach((doc) => {
  try {
    const data = doc.data();
    const coords = JSON.parse(data.coords);
    favorites.push({
      position: coords,
    });
  } catch (error) {
    console.log("Misformatted favorite, skipping");
  }
})

const hotspotsSnapshot = await getDocs(query(collection(db, 'hotspots')));
let hotspots: Array<object> = [];
hotspotsSnapshot.forEach((doc) => {
  try {
    const data = doc.data();
    const coords = JSON.parse(data.coords);
    hotspots.push({
      position: coords,
    });
  } catch (error) {
    console.log("Misformatted hotspot, skipping");
  }

})

</script>

<script lang="ts">

   export default defineComponent({
      methods: {
         filterByCurrentLocationButton() {
          this.$refs.GMapItem.filterByCurrentLocation(document.getElementById("proximityFilter").value);
         },
         filterByFavoriteLocationButton() {
          var dropdown = document.getElementById("favoriteFilter");
          var favoritePosition = dropdown.options[dropdown.selectedIndex].text;
          this.$refs.GMapItem.filterByFavoriteLocation(document.getElementById("proximityFilter").value, favoritePosition);
         },
         filterByHotspotLocationButton() {
          var select = document.getElementById("hotspotFilter");
          //var hotspotPosition = dropdown.options[dropdown.selectedIndex].text;
          let totalLat = 0, totalLng = 0, count = 0;
          Array.from(select.options).forEach((option) => {
            if (option.selected) {
              const hotspot = JSON.parse(option.value)
              console.log(Object.entries(hotspot));
              totalLat += hotspot["lat"];
              totalLng += hotspot["lng"];
              count++;
            }
          })
          const hotspotPosition = {lat: (totalLat / count), lng: (totalLng / count)};
          console.log(hotspotPosition)
          this.$refs.GMapItem.filterByHotspotLocation(document.getElementById("proximityFilter").value, hotspotPosition);
         },
         filterByZipcodeButton() {
          this.$refs.GMapItem.filterByZipcode(document.getElementById("zipcodeFilter").value);
         },
         goToListingsTable(propertyName) {
          this.$refs.ListingsTable.goToProperty(propertyName);
         },
         toggleSelected(hotspot) {

         }
      },
    })
</script>

<template>
  <main>
      <div class="page">
        <div class="content">
          <router-link to="/login">Back to Login Screeeeeen</router-link>
          <router-link to="/moderator/hotspots">Manage Hotspots</router-link>
          <router-link to="/favorites">Manage Favorites</router-link>
          <div>
            <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" style="float:left;" @click="filterByCurrentLocationButton()">Filter by Current Location</button>
            <input type="number" id="proximityFilter" style="color: black; width: 250px; float: top;" placeholder="Enter distance in km">
          </div>
          <div>
            <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" style="float:left;" @click="filterByFavoriteLocationButton()">Filter by Favorite Location</button>
            <select id="favoriteFilter" style="color: black; width: 250px; float: top;">
              <option value="" disabled selected hidden>Select a Favorite Location</option>
              <option v-for="favorite in favorites" :value="favorite.position" :key="favorite.position">
                {{ favorite.position }}
              </option>
            </select>
          </div>
          <div>
            <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" style="float:left;" @click="filterByHotspotLocationButton()">Filter by Hotspot Location</button>
            <select id="hotspotFilter" style="color: black; width: 400px; float: top;" multiple>
              <option v-for="hotspot in hotspots" :value="JSON.stringify(hotspot.position)" :key="hotspot.position">
                {{ hotspot.position }}
              </option>
            </select>
          </div>
          <div>
            <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" style="float:left;" @click="filterByZipcodeButton()">Filter by Zipcode</button>
            <input type="text" id="zipcodeFilter" style="color: black; width: 250px; float: top;" placeholder="Enter Zipcode">
          </div>
          <div class="propertiesTable">
            <listings ref="ListingsTable"></listings>
          </div>
        </div>
        <div class="map">
          <Suspense>
            <GMapItem ref="GMapItem" @listingsTableEvent="goToListingsTable"/>
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