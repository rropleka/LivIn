
<template>
  <div class="score">
    <h1>Cumulative Scores</h1>
    <Suspense>
      <h2 v-if="loadPack.totalReviews > 0">{{ parseFloat(loadPack.totalScore/loadPack.totalReviews+'').toFixed(2) }}</h2>
      <h2 v-else>No Reviews Yet</h2>
    </Suspense>
  </div>
  <div class="reviews">
      <div class="myRev">
        <h1 v-if="loadPack.hasReviewed==true">My Review</h1>
        <ul class="mine"></ul>
        <button v-if="loadPack.hasReviewed==true" v-on:click="edit" type="button">Edit my Review</button>
      </div>
      <div class="otherRevs">
        <h1>Reviews</h1>
        <ul class="users"></ul>
        <h2 v-if="loadPack.totalReviews<=0">No Reviews Yet</h2>
      </div>
  </div>
  <form>
      <div v-if="loadPack.hasReviewed==false||loadPack.isEdit==true" class="leaveRev">
          <h1>Leave a Review</h1>
          <h2>Enter a star rating</h2>
          <input type="number" placeholder="Stars" v-model="form.stars" min="1" max="5" value="5"><br/>
          <h2>Enter a review</h2>
          <!--<input type="text" placeholder="Review" v-model="form.text">-->
          <textarea id="ta" v-model="form.text" rows="7"></textarea>
          <br>
          <button v-if="loadPack.isEdit==false" v-on:click="sub" type="submit">Submit review</button>
          <button v-if="loadPack.isEdit==true" v-on:click="upd" type="submit">Update review</button>
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
                  docRef: '',
                  reviewText: ["t1"],
                  myReview: '',
                  myRating:-1,
                  revRef: '',
                  isEdit:false
                }

            }
        },
        async beforeMount() {
          const db = getFirestore(firebaseapp)
          try {
            const propname="pname123"//replace with current property
            const username="firstuser"
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
            const myList = document.querySelector('.mine')
            const querySnapshot2 = await getDocs(query(collection(db, 'propertyReviews'), where('propertyName', '==', propname), where('owner', '==', ownername)));
            this.loadPack.reviewText.pop()
            querySnapshot2.forEach((doc) => {
              const data = doc.data()
              //this.loadPack.reviewText.push(data.reviewText)
              const userItem = document.createElement('li')
              userItem.innerHTML = `
                ${data.username} says <br>
                ${data.reviewText} <br>
              `
              if (data.username==username) {
                this.loadPack.myReview=data.reviewText
                this.loadPack.myRating=data.stars
                this.loadPack.revRef=doc.ref.path
                myList?.appendChild(userItem)
              } else {
                userList?.appendChild(userItem)
              }
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
                const x = doc(db, this.loadPack.docRef)
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
          },
          edit() {
            console.log("edit")
            this.loadPack.isEdit=true;
            this.form.text=this.loadPack.myReview
            this.form.stars=this.loadPack.myRating.toString()
          },
          async upd() {
            const db = getFirestore(firebaseapp)
            const docRef=doc(db,this.loadPack.revRef)
            await updateDoc(docRef, {
              reviewText: this.form.text,
              stars: this.form.stars,
              timestamp: Date.now()
            });
            //this.rel()
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
  h1 {
    color:black;
  }
  h2 {
    color:red;
  }
  input[type='text'],input[type='number'],textarea{
    color: black;
    border-width: 3px;
    border-style: dashed;
    border-color: teal;
    border-radius: 10px;
  }
  button[type='submit'],button[type='button']{
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
  .reviews {
    border-width: 5px;
    border-style: dashed;
    border-color: orange;
    border-radius: 4px;
    width: fit-content;
    height: fit-content;
    margin: 10px;
    padding: 10px;
  }
  .reviews li {
    color: blueviolet;
    border-width: 5px;
    border-style: dashed;
    border-color: orange;
    border-radius: 4px;
    width: fit-content;
    height: fit-content;
    margin: 10px;
    padding: 10px;
  }
}
</style>
