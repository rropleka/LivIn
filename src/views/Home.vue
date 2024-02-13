<script setup lang="ts">
import { RouterLink } from 'vue-router';
import GMapItem from '@/components/GMapItem.vue';

</script>

<template>
  <main>
    <div class="page">
      <div class="content">
        <router-link to="/login">bbbbb</router-link>
      </div>
      <div class="map">
        <GMapItem />
      </div>
    </div>
  </main>
</template>

<style scoped>
  .map {
    width: 66%;
  }
  .page {
    display: flex;
    justify-content: space-between;
  }
</style>