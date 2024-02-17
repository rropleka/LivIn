
<template>
  <div class="score">
    <h1>Cumulative Scores</h1>
    <Suspense>
      <h2 v-if="loadPack.totalReviews > 0">{{ parseFloat(loadPack.totalScore/loadPack.totalReviews+'').toFixed(2) }}</h2>
      <h2 v-else>No Reviews Yet</h2>
    </Suspense>
    <ul class="users"></ul>
  </div>
  <form>
      <div class="leaveRev">
          <h1>Leave a Review</h1>
          <h2>Enter a star rating</h2>
          <input type="number" placeholder="Stars" v-model="form.stars" min="1" max="5"><br/>
          <h2>Enter a review</h2>
          <!--<input type="text" placeholder="Review" v-model="form.text">-->
          <textarea v-model="form.text" rows="7"></textarea>
          <br>
          <button v-on:click="sub" type="submit">Submit review</button>
      </div>
  </form>
</template>

<script lang="ts">
    import {ref, type PropType} from 'vue';
    import router from '../router/index'
    import Vue from 'vue';
    import { getFirestore, collection, doc, getDocs, updateDoc, getDoc, setDoc, addDoc, query, where, Firestore, DocumentReference } from 'firebase/firestore/lite'
    import { firebaseapp } from '../main'
import type { FirebaseApp } from 'firebase/app';
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
                  totalScore:0,
                  usersReviewed: ["t1", "t2"],
                  docRef: ''
                }

            }
        },
        async beforeMount() {
          const db = getFirestore(firebaseapp)
          try {
            const propname="pname123"//replace with current property
            const username="user123"
            const ownername="owner123"
                
            const querySnapshot = await getDocs(query(collection(db, 'properties'), where('propertyName', '==', propname), where('owner', '==', ownername)));
            //console.log(querySnapshot.size)

            querySnapshot.forEach((doc) => {
              const data = doc.data()
              this.loadPack.totalReviews=data.totalReviews
              this.loadPack.totalScore=data.totalScore
              this.loadPack.usersReviewed=data.usersReviewed
              this.loadPack.hasReviewed=this.loadPack.usersReviewed&&this.loadPack.usersReviewed.length>0&&this.loadPack.usersReviewed.includes(username)
              this.loadPack.docRef=doc.ref.path
            })
            const userList = document.querySelector('.users');
            this.loadPack.usersReviewed.forEach(function(user) {
              console.log("executed")
              const userItem = document.createElement('li')
              userItem.innerHTML = `
                Username: ${user}<br>
              `
              userList?.appendChild(userItem)
            })
            //get array of reviewed properties from querysnapshot
            //check against selected listing to set hasReviewed
            } catch(error) {
                // Handle any errors
                const errorMessage = error;
                alert(errorMessage);
            }
          return {
            //set data
          }
        },
        methods: {
          async sub() {
            const propname="pname123"//replace with current property
            const username="user123"
            const ownername="owner123"
            if(typeof this.form.stars!='undefined' && this.form.stars) {
              //console.log(this.form.stars)
              const db = getFirestore(firebaseapp)
              try {
                if(this.loadPack.usersReviewed&&this.loadPack.usersReviewed.length>0) { 
                  this.loadPack.usersReviewed.push(username)
                } else {
                  this.loadPack.usersReviewed=[username]
                }
                /*const docRef = this.getDocRef(firebaseapp, propname, ownername)
                console.log("docref:" + docRef)*/
                //console.log("before: " + this.loadPack.docRef)
                const x = doc(db, this.loadPack.docRef)
                //console.log("after: " + this.loadPack.docRef)
                this.submitReview(db, propname, ownername, username) //push to reviews
                this.updateProperty(db, propname, ownername, x) //update property info
              } catch(error) {
                // Handle any errors
                const errorMessage = error;
                alert(errorMessage);
            }
              //good submission, continue
            } else {
              console.log('issue')
              //throw error
            }
          }, 
          async submitReview (db: Firestore, propname: string, ownername: string, username: string){
            const docRef = await addDoc(collection(db, "propertyReviews"), {
              owner: ownername,
              propertyName: propname,
              username: username,
              reviewText: this.form.text,
              stars: this.form.stars,
              timestamp: Date.now()
            });
          }, 
          async updateProperty (db: Firestore, propname: string, ownername: string, userDocRef: DocumentReference<unknown, {}>) {
            await updateDoc(userDocRef, {
                totalReviews: this.loadPack.totalReviews+1,
                totalScore: this.loadPack.totalScore+this.form.stars,
                usersReviewed: this.loadPack.usersReviewed
            });
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
  .score li {
    color: blueviolet;
  }
}
</style>
