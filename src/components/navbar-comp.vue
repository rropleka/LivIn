<script setup>

</script>

<template>
<div class="p-0 m-0">
  <nav class="bg-orange p-0 my-0 border-gray-200 dark:bg-gray-900">
    <div class=" flex flex-wrap items-center justify-between mx-5 p-4">
      <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="../assets/LivInLogo.png" class="h-8" alt="LivIn' Logo" />
      </router-link>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
          <li>
            <router-link to="/login" class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Signup / Login</router-link>
            <router-link to="/listings" class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Listings</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
</template>

