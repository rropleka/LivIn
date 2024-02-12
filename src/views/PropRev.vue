<template>
  <div class="score">
    <h1>Cumulative Scores</h1>
    <h2>{{ loadPack.totalReviews }}</h2>
  </div>
  <form @submit.prevent="prev">
      <div class="leaveRev">
          <h1>Leave a Review</h1>
          <h2>Enter a star rating</h2>
          <input type="number" placeholder="Stars" v-model="form.stars" min="1" max="5"><br/>
          <h2>Enter a review</h2>
          <!--<input type="text" placeholder="Review" v-model="form.text">-->
          <textarea v-model="form.text"></textarea>
          <br>
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
                },
                loadPack: {
                  hasReviewed:false,
                  totalReviews:0,
                  totalScore:0
                }

            }
        },
        beforeMount() {
          //load data 
          return {
            //set data
            this:this.loadPack.hasReviewed=true
          }
        },
        methods: {
          sub() {
            console.log(this.loadPack.hasReviewed)
            if(typeof this.form.stars!='undefined' && this.form.stars) {
              console.log(this.form.stars)
              //good submission, continue
            } else {
              console.log('issue')
              //throw error
            }
            //console.log(this.form.stars)
          }
        }
    }
</script>

<style>
@media (min-width: 1024px) {
  .leaveRev {
    align-items: center;
    border-width: 5px;
    border-style: dashed;
    border-color: orange;
    border-radius: 4px;
    width: fit-content;
    height: fit-content;
    margin: 10px;
    padding: 10px;
  }
  .leaveRev h1 {
    color:black;
  }
  .leaveRev h2 {
    color:red;
  }
  input[type='text'],input[type='number'],textarea{
    color: black;
    border-width: 3px;
    border-style: dashed;
    border-color: teal;
    border-radius: 10px;
  }
  button[type='submit']{
    background-color: cadetblue;
    margin: 5px;
    margin-left: 0px;
    padding: 5px;
    color: white;
    border-radius: 10px;
  }
  button[type='submit']:hover {
    background-color: lightcoral;
  }
  .score {
    align-items: center;
    border-width: 5px;
    border-style: dashed;
    border-color: orange;
    border-radius: 4px;
    width: fit-content;
    height: fit-content;
    margin: 10px;
    padding: 10px;
    color: black;
  }
}
</style>
