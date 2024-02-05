<script setup lang="ts">
import { RouterView, useRouter, useRoute } from 'vue-router'
import router from './router/index'
import {createApp} from 'vue';
import { onBeforeMount } from 'vue';
import firebase from 'firebase/compat/app';
import Navbar from './components/navbar-comp.vue';
import Login from './views/Login.vue'

const app = createApp({});
app.use(router); //trust me bro
app.mount('#app');



</script>

<template>
  <div class="page">
    <Navbar />
    <router-view/>
  </div>
</template>

<style scoped>

.icon {
  background-color: white;
  width: 30px;
  height: 30px;
  border-radius: 15px;
}

.name {
  font-size: 30px;
  font-family: serif;
}

input {
  height: 30px;
  width: 33%;
  border-radius: 5px;
  border: solid #FFFFFFF0;
  padding-inline: 10px;
  font-size: 15px;
}

header {
  line-height: 1.5;
  background-color: #e8871e;
  color: white;
  top: 0;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-inline: 20px;
}

.page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {

  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
