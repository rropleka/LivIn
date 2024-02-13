
<template>
  <div class="score">
    <h1>Cumulative Scores</h1>
    <Suspense>
    <h2>{{ loadPack.totalReviews }}</h2>
    </Suspense>
  </div>
  <form>
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
    import { getFirestore, collection, doc, getDocs, updateDoc, getDoc, setDoc, query, where } from 'firebase/firestore/lite'
    import { firebaseapp } from '../main'
    //import { StarRating } from './components/vue-star-rating/src/star-rating.vue';


    export default {
        components: {
            //starrating: StarRating
        },
        /*async setup() {
          const db = getFirestore(firebaseapp)
          try {
            const username="test"//replace with current user
            const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
            //get array of reviewed properties from querysnapshot
            //check against selected listing to set hasReviewed
            } catch(error) {
                // Handle any errors
                const errorMessage = error.message;
                alert(errorMessage);
            }
        },*/
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
        async beforeMount() {
          const db = getFirestore(firebaseapp)
          try {
            const propname="pname123"//replace with current user
            const querySnapshot = await getDocs(query(collection(db, 'properties'), where('propertyName', '==', propname)));
            console.log(querySnapshot.size)
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              this.loadPack.totalReviews=data.totalReviews
              this.loadPack.totalScore=data.totalScore
              console.log(this.$data)
              console.log("hello")
            })
            //get array of reviewed properties from querysnapshot
            //check against selected listing to set hasReviewed
            } catch(error) {
                // Handle any errors
                const errorMessage = "error";
                alert(errorMessage);
            }
          return {
            //set data
            this:this.loadPack.hasReviewed=true,//=arry contains property

          }
        },
        methods: {
          async sub() {
            console.log(this.loadPack.hasReviewed)
            if(typeof this.form.stars!='undefined' && this.form.stars) {
              console.log(this.form.stars)
              const db = getFirestore(firebaseapp)
              try {
                const userDocRef = doc(collection(db, 'properties'), "pname123");
                await updateDoc(userDocRef, {
                    reviewText: this.form.text, // Add username to firestore associated with uid
                    totalReviews: this.loadPack.totalReviews+1,
                    totalScore: this.loadPack.totalScore+this.form.stars
                });
                console.log(this.loadPack.totalScore+this.form.stars)
              } catch(error) {
                // Handle any errors
                const errorMessage = "error";
                alert(errorMessage);
            }
              //good submission, continue
            } else {
              console.log('issue')
              //throw error
            }
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
  input[type='text'],input[type='number']{
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
