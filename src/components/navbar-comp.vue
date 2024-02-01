<script setup>

</script>

<template>

<nav class="bg-orange border-gray-200 dark:bg-gray-900">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="../assets/LivInLogo.png" class="h-8" alt="LivIn' Logo" />
    </router-link>
    <div class="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <router-link to="/login" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">Log in</router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>

</template>

