<template>
  <form @submit.prevent="prev">
      <div class="leaveRev">
          <h1>Leave a Review</h1>
          <h2>Enter a star rating</h2>
          <input type="number" placeholder="Stars" v-model="form.stars"><br/>
          <h2>Enter a review</h2>
          <input type="text" placeholder="Review" v-model="form.text">
          <button v-on:click="sub" type="submit">Submit review</button>
      </div>
  </form>
</template>

<script lang="ts">
    import {ref} from 'vue';
    import router from '../router/index'
    import Vue from 'vue';
    //import { StarRating } from './components/vue-star-rating/src/star-rating.vue';


    export default {
        components: {
            //starrating: StarRating
        },
        data() {
            return {
                form: {
                  stars:'',
                  text:''
                }
            }
        },
        methods: {
          sub() {
            
          }
        }
    }
    console.log('hello script setup')
</script>

<style>
@media (min-width: 1024px) {
  .leaveRev {
    min-height: 100vh;
    align-items: center;
  }
  .leaveRev h1 {
    color:black;
  }
  .leaveRev h2 {
    color:red;
  }
}
</style>
