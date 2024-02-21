<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex';
import { getFirestore,  doc,  getDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import { getAuth } from "firebase/auth";


const store = useStore();

const isLoggedIn = computed(() => store.getters.isLoggedIn);
const logout = computed(() => store.dispatch('logoutUser'));

const isLeasingCompany = ref(true);

onMounted(async () => {
  const auth = getAuth();
  // console.log(auth.currentUser);
  // auth.onAuthStateChanged(async (user) => {
  //   if (user) {
  //     try {
  //       const db = getFirestore(firebaseapp);
  //       const userDocRef = doc(db, 'users', user.uid);
  //       const userDocSnap = await getDoc(userDocRef);

  //       if (userDocSnap.exists()) {
  //         const userData = userDocSnap.data();
  //         if (userData.userType === "leasingCompany") {
  //           isLeasingCompany.value = true;
  //         }
  //       } else {
  //         console.error('User document does not exist.');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   } else {
  //     console.error('User not authenticated!');
  //   }
  // });
});
</script>

<template>
<div class="p-0 m-0">
  <nav class=" bg-orange-300 p-0 my-0 border-gray-200 dark:bg-gray-900">
    <div class=" flex flex-wrap items-center justify-between mx-5 p-4">
      <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="../assets/LivInLogo.png" class="h-8" alt="LivIn' Logo" />
      </router-link>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
          <li>
              <router-link to="/compare" class="block ml-4 py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Compare</router-link>
            </li>
          <div v-if="isLoggedIn" class="flex flex-row">
            <li>
              <router-link to="/Profile" class="block ml-4 py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Profile</router-link>
            </li>
            <li>
              <router-link to="/revprop" class="block ml-4 py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Review Property</router-link>
            </li>
            <li v-if="isLeasingCompany">
              <router-link to="/add-property" class="block ml-4 py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Add Property</router-link>
            </li>
            <li @click.prevent="logout">
              <router-link to="/"  class="block ml-4 py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Logout</router-link>
            </li>
          </div>
          <div v-else>
            <li>
              <router-link to="/login" class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Signup / Login</router-link>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>
</div>
</template>

