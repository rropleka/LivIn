<template>
  <div class="property-card" v-if="property && loadPack.hasLoaded">
    <div class="property-image">
      <img src="../assets/house.jpeg" alt="Property Image">
    </div>
    <div class="property-details">
      <h2 class="property-title">{{ property.propertyName }}</h2>
      <p class="property-price"> {{ property.rent }}</p>
      <!-- <p class="property-bed-bath">{{ propertyInfo.bedBath }}</p> -->
      <p class="property-location">{{ property.location }}</p>
      <div class="into">
        <input type="checkbox" id="interest" name="interest" @click="updateInterest"/>
        <label for="interest">I'm interested</label>
        <button v-if="loadPack.interest==true" id="interestHover" @click="changePopUp">Click to see who else is!</button>
        <div class="hoverbox" id="hoverbox">
          <h1>Interested Users</h1>
          <button type="button" @click="changePopUp">Close</button>
          <ul class="interestedOthers"></ul>
        </div>
      </div>
      <hr>
      <p class="property-about">About property:</p>
      <p class="property-description">{{ property.structureDetails }}</p>
      <p class="property-owned-by">Owned By:</p>
      <p class="property-owner-name">{{ property.owner }}</p>
      <!-- <p class="property-owner-company">{{ propertyInfo.ownerCompany }}</p> -->
      <button class="contact-owner-button">Contact Owner</button>
      <button v-if="isCurrentUserOwner1 || isSiteModerator" class="remove-property-button" @click="removeProperty">Remove Property</button>
      <button v-if="isCurrentUserOwner1" class="edit-property-button" @click="editProperty">Edit Property</button>
      <hr>
      <p class="amenities-title">Amenities:</p>
      <div class="amenities-list">
  <button v-for="(amenity, index) in property.amenities" :key="index" class="amenity-button">{{ amenity }}</button>
</div>
      <div class="rating">
      </div>
    </div>
    
  </div>
  <div v-else>
    <!-- <p>Loading...</p> -->
    <div class="loading-spinner"></div>
  </div>
  
  <div class="row">
  <div class="column">
    <div class="score">
    <h1>Property Cumulative Score</h1>
      <h2 v-if="loadPack.totalReviews > 0">{{ parseFloat(loadPack.totalScore/loadPack.totalReviews+'').toFixed(2) }}</h2>
      <h2 v-else>No Reviews Yet</h2>
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
          <h2>Enter a rating</h2>
          <input type="number" placeholder="Stars" v-model="form.stars" min="1" max="5" value="5"><br/>
          <h2>Enter a review</h2>
          <!--<input type="text" placeholder="Review" v-model="form.text">-->
          <textarea id="ta" v-model="form.text" rows="7"></textarea>
          <br>
          <button v-if="loadPack.isEdit==false" v-on:click="sub" type="button">Submit review</button>
          <button v-if="loadPack.isEdit==true" v-on:click="upd" type="button">Update review</button>
      </div>
  </form>
</div>
<div class="column">
  <div class="score">
    <h1>Owner Cumulative Score</h1>
    
      <h2 v-if="cloadPack.totalReviews > 0">{{ parseFloat(cloadPack.totalScore/cloadPack.totalReviews+'').toFixed(2) }}</h2>
      <h2 v-else>No Reviews Yet</h2>
    
  </div>
  <div class="creviews">
      <div class="myRev">
        <h1 v-if="cloadPack.hasReviewed==true">My Review</h1>
        <ul class="cmine"></ul>
        <button v-if="cloadPack.hasReviewed==true" v-on:click="cedit" type="button">Edit my Review</button>
      </div>
      <div class="otherRevs">
        <h1>Reviews</h1>
        <ul class="cusers"></ul>
        <h2 v-if="cloadPack.totalReviews<=0">No Reviews Yet</h2>
      </div>
  </div>
  <form>
      <div v-if="cloadPack.hasReviewed!=true||cloadPack.isEdit==true" class="leaveRev">
          <h1>Leave a Review</h1>
          <h2>Enter a rating</h2>
          <input type="number" placeholder="Stars" v-model="cform.stars" min="1" max="5" value="5"><br/>
          <h2>Enter a review</h2>
          <!--<input type="text" placeholder="Review" v-model="form.text">-->
          <textarea id="ta" v-model="cform.text" rows="7"></textarea>
          <br>
          <button v-if="cloadPack.isEdit==false" v-on:click="csub" type="button">Submit review</button>
          <button v-if="cloadPack.isEdit==true" v-on:click="cupd" type="button">Update review</button>
      </div>
  </form>
</div>
</div>

  
</template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import {ref} from 'vue';
  import router from '../router/index'
  import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, where, deleteDoc, addDoc, updateDoc, Firestore, DocumentReference } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
  
  export default {
  props: {
    leasingCompany: {
      type: String,
      required: true
    },
    propertyName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      property: null,
      isCurrentUserOwner1: false,
      isSiteModerator: false,
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
        isEdit:false,
        hasLoaded:false,
        username:'',
        interest:false,
        interestedUsers: ["user1", "user2", "user3"]
      },
      cform: {
        stars:'',
        text:''
      },
      cloadPack: {
        hasReviewed:false,
        totalReviews:0,
        totalScore:0,
        usersReviewed: ["t1", "t2"],
        docRef: '',
        reviewText: ["t1"],
        myReview: '',
        myRating:-1,
        revRef: '',
        isEdit:false,
        hasLoaded:false,
        username:''
      }
    };
  },
  async mounted() {
    const auth = getAuth();
  const currentUser = auth.currentUser;

  // If the user is not logged in, redirect to the login page
  if (!currentUser) {
    router.push({ name: 'login' });
    return;
  }
    try {
      const propertyData = await this.propertyExists(this.leasingCompany, this.propertyName);
      // call to validateCurrentUser if owner and display edit and remove button
      await this.validateCurrentUserOwner();
      if (propertyData) {
        this.property = propertyData;
      } else {
        router.push({ name: 'not-found' });
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
      router.push({ name: 'not-found' });
    }
  },
  async beforeMount() {
          const db = getFirestore(firebaseapp)
          
          try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const propname=this.propertyName//replace with current property
            const userDoc=currentUser.uid
            const userDocRef = doc(db, 'users', userDoc);
            const userDocSnap = await getDoc(userDocRef);
            const username=userDocSnap.data().username
            this.loadPack.username=username
            console.log("***username: " + username)
            const ownername=this.leasingCompany
            //start old    
            const querySnapshot = await getDocs(query(collection(db, 'properties'), where('propertyName', '==', propname), where('owner', '==', ownername)));
            //console.log(querySnapshot.size)
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              this.loadPack.totalReviews=data.totalReviews
              if(!(this.loadPack.totalReviews>=0)) {
                this.loadPack.totalReviews=0
              }
              this.loadPack.totalScore=data.totalScore
              if(!(this.loadPack.totalScore>=0)) {
                this.loadPack.totalScore=0
              }
              this.loadPack.usersReviewed=data.usersReviewed
              this.loadPack.hasReviewed=this.loadPack.usersReviewed&&this.loadPack.usersReviewed.length>0&&this.loadPack.usersReviewed.includes(username)
              if(this.loadPack.hasReviewed===undefined) {
                this.loadPack.hasReviewed=false
              }
              this.loadPack.docRef=doc.ref.path
            })
            console.log("qsempty" + querySnapshot.empty)
            this.loadPack.hasLoaded=!querySnapshot.empty
            console.log("dump: " + this.loadPack.totalReviews + " " + this.loadPack.totalScore)
            const userList = document.querySelector('.users');
            const myList = document.querySelector('.mine')
            const querySnapshot2 = await getDocs(query(collection(db, 'propertyReviews'), where('propertyName', '==', propname), where('owner', '==', ownername)));
            console.log("qsempty2" + querySnapshot2.empty)
            this.loadPack.reviewText.pop()
            querySnapshot2.forEach((doc) => {
              console.log("in qs2 loop")
              const data = doc.data()
              //this.loadPack.reviewText.push(data.reviewText)
              const userItem = document.createElement('li')
              userItem.innerHTML = `
                ${data.username} says <br>
                ${data.reviewText} <br><br>
              `
              if (data.username==username) {
                this.loadPack.myReview=data.reviewText
                this.loadPack.myRating=data.stars
                this.loadPack.revRef=doc.ref.path
                myList?.appendChild(userItem)
              } else {
                console.log("other appeand***")
                userList?.appendChild(userItem)
              }
            })
            //end old
            const querySnapshot3 = await getDocs(query(collection(db, 'users'), where('username', '==', ownername)));
            console.log("qs3size: " + querySnapshot3.size)
            querySnapshot3.forEach((docs) => {
              const data = docs.data()
              this.cloadPack.totalReviews=data.totalReviews
              if(!(this.cloadPack.totalReviews>=0)) {
                this.cloadPack.totalReviews=0
              }
              this.cloadPack.totalScore=data.totalScore
              if(!(this.cloadPack.totalScore>=0)) {
                this.cloadPack.totalScore=0
              }
              this.cloadPack.usersReviewed=data.usersReviewed
              this.cloadPack.hasReviewed=this.cloadPack.usersReviewed&&this.cloadPack.usersReviewed.length>0&&this.cloadPack.usersReviewed.includes(username)
              this.cloadPack.docRef=docs.ref.path
            })
            console.log("dump: " + this.cloadPack.totalReviews + " " + this.cloadPack.totalScore)

            const cuserList = document.querySelector('.cusers');
            const cmyList = document.querySelector('.cmine')
            const querySnapshot4 = await getDocs(query(collection(db, 'lenderReviews'), where('owner', '==', ownername)));
            console.log("qsempty2" + querySnapshot4.empty)
            this.cloadPack.reviewText.pop()
            querySnapshot4.forEach((doc) => {
              console.log("in qs2 loop")
              const data = doc.data()
              //this.loadPack.reviewText.push(data.reviewText)
              const userItem = document.createElement('li')
              userItem.innerHTML = `
                ${data.username} says <br>
                ${data.reviewText} <br><br>
              `
              if (data.username==username) {
                this.cloadPack.myReview=data.reviewText
                this.cloadPack.myRating=data.stars
                this.cloadPack.revRef=doc.ref.path
                cmyList?.appendChild(userItem)
              } else {
                console.log("other appeand***")
                cuserList?.appendChild(userItem)
              }
            })
            this.updateUsersList()
            } catch(error) {
                // Handle any errors
                const errorMessage = error;
                alert(errorMessage);
            }
            console.log("***bm " + this.loadPack.hasReviewed + this.loadPack.isEdit)
          return {
            //set data
          }
        },
  methods: {
    async validateCurrentUserOwner() {
      console.log("inside currentUserOwner");
      const db = getFirestore(firebaseapp);
      const usersCollectionRef = collection(db, 'users');
    const userQuerySnapshot = await getDocs(query(usersCollectionRef, where("username", "==", this.leasingCompany)));
    let isCurrentUserOwner = false;
    let isSiteModerator = false;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserID = currentUser.uid;
    userQuerySnapshot.forEach(userDoc => {
        // Retrieve the property data
        const userData = userDoc.data();
        // Retrieve the UID assigned to the property
        const userUID = userDoc.id;
        console.log("User UID:", userUID);
        console.log("current user ID", currentUserID);
        console.log("are equivalent", currentUserID == userUID);
        if(userUID == currentUserID) {
          isCurrentUserOwner = true;
        }
    });
    this.isCurrentUserOwner1 = isCurrentUserOwner;

    try {
        const userDocRef = doc(db, 'users', currentUserID);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log(userData);
          if (userData.userType) {
              if(userData.userType == "sitemoderator") {
                isSiteModerator = true;
              }
        }
        } else {
          console.error('User data does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }

    this.isSiteModerator = isSiteModerator;

    },
    async editProperty() {
      const db = getFirestore(firebaseapp);
      const propertiesCollectionRef = collection(db, 'properties');
      const propertyQuerySnapshot = await getDocs(query(propertiesCollectionRef, 
        where("propertyName", "==", this.propertyName),
        where("owner", "==", this.leasingCompany)));

        if (!propertyQuerySnapshot.empty) {
    // If there are matching properties, loop through the snapshot
    propertyQuerySnapshot.forEach(propertyDoc => {
        // Retrieve the property data
        const propertyData = propertyDoc.data();
        
        // Retrieve the UID assigned to the property
        const propertyUID = propertyDoc.id;
        console.log("Property UID to edit:", propertyUID);
        router.push({ name: 'edit-property', params: { id: propertyUID } });
    });  
  }
    },
    async removeProperty() {
      const confirmDelete = confirm("Are you sure you want to delete this property?");

      if (confirmDelete) {
      const db = getFirestore(firebaseapp);
      const propertiesCollectionRef = collection(db, 'properties');
      const propertyQuerySnapshot = await getDocs(query(propertiesCollectionRef, 
        where("propertyName", "==", this.propertyName),
        where("owner", "==", this.leasingCompany)));
        

      if (!propertyQuerySnapshot.empty) {
    // If there are matching properties, loop through the snapshot
    propertyQuerySnapshot.forEach(propertyDoc => {
        // Retrieve the property data
        const propertyData = propertyDoc.data();
        
        // Retrieve the UID assigned to the property
        const propertyUID = propertyDoc.id;
        console.log("Property UID to remove:", propertyUID);

        const propertyDocRef = doc(db, 'properties', propertyUID);
        deleteDoc(propertyDocRef).then(() => {
          console.log("Property removed successfully!");
          router.push('/');
        }).catch(error => {
          console.error("Error removing property:", error);
        });
    });
  }

  // delete using property id

} else {
  console.log("Deletion canceled.");
}
    },
    async propertyExists(leasingCompany, propertyName) {
      console.log("inside property page");
      console.log(leasingCompany, propertyName);
      try {
    const db = getFirestore(firebaseapp);

    // Query the users collection to find the leasing company
    const usersCollectionRef = collection(db, 'users');
    const userQuerySnapshot = await getDocs(query(usersCollectionRef, where("username", "==", leasingCompany)));

    // Check if the leasing company exists
    if (userQuerySnapshot.empty) {
        return false;
    }
    const leasingCompanyData = userQuerySnapshot.docs[0].data();

    // Query the properties collection to find the property
    const propertiesCollectionRef = collection(db, 'properties');
    const propertyQuerySnapshot = await getDocs(query(propertiesCollectionRef, 
        where("propertyName", "==", propertyName),
        where("owner", "==", leasingCompany)));

    // Check if the property exists within the leasing company
    if (propertyQuerySnapshot.empty) {
        return false;
    }
    const propertyData = propertyQuerySnapshot.docs[0].data();
    console.log("found property1");
    // console.log(leasingCompanyData);
    console.log(propertyData);
    console.log(propertyData.propertyName);
    console.log(propertyData.amenities);
    return propertyData;
} catch (error) {
    console.error('Error checking property existence:', error);
    const defdata = {propertyName: 'Sample Property',
          rent: 2000,
          location: 'Sample Location',
          structureDetails: 'Sample Structure Details',
          owner: 'Sample Owner',
          amenities: ['Amenity 1', 'Amenity 2']};
    return defdata;
}
    },
    async sub() {
            console.log("submethod")
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const propname=this.propertyName//replace with current property
            const userDoc=currentUser.uid
            const db = getFirestore(firebaseapp)
            const userDocRef = doc(db, 'users', userDoc);
            console.log("did i hang here")
            //const userDocSnap = await getDoc(userDocRef);
            //const username=userDocSnap.data().username
            const username = this.loadPack.username
            console.log("***sub username: " + username)
            const ownername=this.leasingCompany
            if(typeof this.form.stars!='undefined' && this.form.stars) {
              //console.log(this.form.stars)
              //const db = getFirestore(firebaseapp)
              try {
                if(this.loadPack.usersReviewed&&this.loadPack.usersReviewed.length>0) { 
                  this.loadPack.usersReviewed.push(username)
                } else {
                  this.loadPack.usersReviewed=[username]
                }
                console.log("andrew here 1")
                const x = doc(db, this.loadPack.docRef)
                console.log("andrew here 2")
                const sr = await this.submitReview(db, propname, ownername, username) //push to reviews
                //console.log("andrew here 3: " + sr)
                await this.updateProperty(x) //update property info
                console.log("andrew here 4")
              } catch(error) {
                // Handle any errors
                const errorMessage = error;
                alert(errorMessage);
            }
              location.reload()
            } else {
              alert("Please enter a numerical rating")
              //throw error
            }
            
          }, 
          async submitReview (db, propname, ownername, username){
            const c = collection(db, "propertyReviews");
            try {
            const docRef = await addDoc(c, {
              owner: this.leasingCompany,
              propertyName: this.propertyName,
              username: username,
              reviewText: this.form.text,
              stars: this.form.stars,
              timestamp: Date.now()
            });
            console.log("doc with id: " + docRef)
          } catch (error) {
            const errorMessage = error;
                alert(errorMessage);
          }
          }, 
          async updateProperty (userDocRef) {
            try {
              console.log("***in update" + this.loadPack.totalReviews + " " + this.loadPack.totalScore)
              await updateDoc(userDocRef, {
                  totalReviews: this.loadPack.totalReviews+1,
                  totalScore: Number(this.loadPack.totalScore)+Number(this.form.stars),
                  usersReviewed: this.loadPack.usersReviewed
              });
            } catch (error) {
              const errorMessage = error;
              alert(errorMessage);
            }
          },
          edit() {
            console.log("edit")
            this.loadPack.isEdit=true;
            this.form.text=this.loadPack.myReview
            this.form.stars=this.loadPack.myRating.toString()
          },
          async upd() {
            const db = getFirestore(firebaseapp);
            const x = doc(db, this.loadPack.docRef)
            if(typeof this.form.stars!='undefined' && this.form.stars) {
            const db = getFirestore(firebaseapp)
            const docRef=doc(db,this.loadPack.revRef)
            /*await updateDoc(x, {
                  totalReviews: this.loadPack.totalReviews,
                  totalScore: this.loadPack.totalScore-this.loadPack.myRating+this.form.stars-100,
                  usersReviewed: this.loadPack.usersReviewed
              });*/
            await this.updateReview()
            await this.updatePropScore()
            location.reload()
            //this.rel()
          } else {
            alert("Please enter a numerical rating")
          }
          }, async updateReview() {
              const db = getFirestore(firebaseapp);
              const x = doc(db, this.loadPack.docRef)
              if(typeof this.form.stars!='undefined' && this.form.stars) {
              const db = getFirestore(firebaseapp)
              const docRef=doc(db,this.loadPack.revRef)
              await updateDoc(docRef, {
                reviewText: this.form.text,
                stars: this.form.stars,
                timestamp: Date.now()
              });
            }
          }, async updatePropScore() {
              const db = getFirestore(firebaseapp);
              const x = doc(db, this.loadPack.docRef)
              if(typeof this.form.stars!='undefined' && this.form.stars) {
              const db = getFirestore(firebaseapp)
              const docRef=doc(db,this.loadPack.revRef)
              console.log("total: " + typeof this.loadPack.totalScore + " mine: " + typeof this.loadPack.myRating + " stars: " + typeof this.form.stars)
              await updateDoc(x, {
                    totalReviews: this.loadPack.totalReviews,
                    totalScore: Number(this.loadPack.totalScore)-Number(this.loadPack.myRating)+Number(this.form.stars),
                    usersReviewed: this.loadPack.usersReviewed
                });
            }
          },
          async csub() {
            console.log("submethod")
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const propname=this.propertyName//replace with current property
            const userDoc=currentUser.uid
            const db = getFirestore(firebaseapp)
            const userDocRef = doc(db, 'users', userDoc);
            console.log("did i hang here")
            //const userDocSnap = await getDoc(userDocRef);
            //const username=userDocSnap.data().username
            const username = this.loadPack.username 
            console.log("***sub username: " + username)
            const ownername=this.leasingCompany
            if(typeof this.cform.stars!='undefined' && this.cform.stars) {
              //console.log(this.cform.stars)
              //const db = getFirestore(firebaseapp)
              try {
                if(this.cloadPack.usersReviewed&&this.cloadPack.usersReviewed.length>0) { 
                  this.cloadPack.usersReviewed.push(username)
                } else {
                  this.cloadPack.usersReviewed=[username]
                }
                console.log("andrew here 1")
                const x = doc(db, this.cloadPack.docRef)
                console.log("andrew here 2" + this.cloadPack.docRef)
                const sr = await this.csubmitReview(db, propname, ownername, username) //push to reviews
                //console.log("andrew here 3: " + sr)
                await this.cupdateProperty(x) //update property info
                console.log("andrew here 4 c")
              } catch(error) {
                // Handle any errors
                const errorMessage = error;
                alert(errorMessage);
            }
              location.reload()
              //good submission, continue
            } else {
              alert("Please enter a numerical rating")
              //throw error
            }
          }, 
          async csubmitReview (db, propname, ownername, username){
            const c = collection(db, "lenderReviews");
            try {
            const docRef = await addDoc(c, {
              owner: this.leasingCompany,
              propertyName: this.propertyName,
              username: username,
              reviewText: this.cform.text,
              stars: this.cform.stars,
              timestamp: Date.now()
            });
            console.log("doc with id: " + docRef)
          } catch (error) {
            const errorMessage = error;
                alert(errorMessage);
          }
          }, 
          async cupdateProperty (userDocRef) {
            try {
              console.log("***in update cupcake" + userDocRef)
              await updateDoc(userDocRef, {
                  totalReviews: this.cloadPack.totalReviews+1,
                  totalScore: Number(this.cloadPack.totalScore)+Number(this.cform.stars),
                  usersReviewed: this.cloadPack.usersReviewed
              });
              console.log("***in update cupcake after" + userDocRef)
            } catch (error) {
              const errorMessage = error;
              alert(errorMessage);
            }
          },
          cedit() {
            console.log("edit")
            this.cloadPack.isEdit=true;
            this.cform.text=this.cloadPack.myReview
            this.cform.stars=this.cloadPack.myRating.toString()
          },
          async cupd() {
            const db = getFirestore(firebaseapp);
            const x = doc(db, this.cloadPack.docRef)
            if(typeof this.cform.stars!='undefined' && this.cform.stars) {
            const db = getFirestore(firebaseapp)
            const docRef=doc(db,this.cloadPack.revRef)
            /*await updateDoc(x, {
                  totalReviews: this.cloadPack.totalReviews,
                  totalScore: this.cloadPack.totalScore-this.cloadPack.myRating+this.cform.stars-100,
                  usersReviewed: this.cloadPack.usersReviewed
              });*/
            await this.cupdateReview()
            await this.cupdatePropScore()
            location.reload()
            //this.rel()
          } else {
            alert("Please enter a numerical rating")
          }
          }, async cupdateReview() {
              const db = getFirestore(firebaseapp);
              const x = doc(db, this.cloadPack.docRef)
              if(typeof this.cform.stars!='undefined' && this.cform.stars) {
              const db = getFirestore(firebaseapp)
              const docRef=doc(db,this.cloadPack.revRef)
              await updateDoc(docRef, {
                reviewText: this.cform.text,
                stars: this.cform.stars,
                timestamp: Date.now()
              });
            }
          }, async cupdatePropScore() {
              const db = getFirestore(firebaseapp);
              const x = doc(db, this.cloadPack.docRef)
              if(typeof this.cform.stars!='undefined' && this.cform.stars) {
              const db = getFirestore(firebaseapp)
              const docRef=doc(db,this.cloadPack.revRef)
              console.log("total: " + this.cloadPack.totalScore + " mine: " + this.cloadPack.myRating + " stars: " + typeof this.cform.stars)
              await updateDoc(x, {
                    totalReviews: this.cloadPack.totalReviews,
                    totalScore: Number(this.cloadPack.totalScore)-Number(this.cloadPack.myRating)+Number(this.cform.stars),
                    usersReviewed: this.cloadPack.usersReviewed
                });
            }
          }, sleep(milliseconds) {
              var start = new Date().getTime();
              for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                  break;
                }
              }
            },
          updateInterest() {
            console.log("before: " + this.loadPack.interestedUsers)
            const hoverbox = document.getElementById("hoverbox");
            hoverbox.style.display="none";
            if(!this.loadPack.interest) {
              this.loadPack.interest=true
              if(!this.loadPack.interestedUsers.includes(this.loadPack.username)) {
                this.loadPack.interestedUsers.push(this.loadPack.username)
              }
            } else {
              this.loadPack.interest=false;
              let newarr = this.loadPack.interestedUsers.filter(val => val !== this.loadPack.username);
              this.loadPack.interestedUsers=newarr;
            }
            console.log("after: " + this.loadPack.interestedUsers)
            this.updateUsersList()
            const hoverDisplay = document.getElementById("interestHover");
            if (hoverDisplay.style.display != "none") {
              hoverDisplay.style.display = "none";
            } else {
              hoverDisplay.style.display = "block";
            }
            //const hoverbox = document.getElementById("hoverbox");
            if (hoverbox.style.display != "none") {
              hoverbox.style.display = "none";
            }
            //value=!value
            //push to backend
            //data will be stored with property in an array
            //hide/show other users
          },
          changePopUp() {
            const hoverbox = document.getElementById("hoverbox");
            console.log(hoverbox.style.display)
            if (hoverbox.style.display === "none") {
              hoverbox.style.display = "block";
            } else {
              hoverbox.style.display = "none";
            }
            //value=!value
            //push to backend
            //data will be stored with property in an array
            //hide/show other users
          },
          updateUsersList() {
            this.clearUsersList()
            const interestList = document.querySelector('.interestedOthers');
            //add from querysnapsho other users
            this.loadPack.interestedUsers.forEach((interestedUser)=>{
              const profItem = document.createElement('li')
              if(interestedUser!=this.loadPack.username) {
              profItem.innerHTML = `
                <a href="https://www.google.com">${interestedUser} //change link to actual link
              `
              }
              interestList?.appendChild(profItem)
            })
          }, 
          clearUsersList() {
            const interestList = document.querySelector('.interestedOthers');
            while (interestList && interestList.firstChild) {
              interestList.removeChild(interestList.lastChild);
            }
          }
  }
};
  </script>
  
  <style scoped>

.loading-spinner {
  border: 4px solid rgba(255, 165, 0, 0.2); /* Orange color with transparency */
  border-radius: 50%;
  border-top: 4px solid #ffa500; /* Orange color */
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite; /* Spin animation */
  margin: 20px auto; /* Center the spinner */
}

.property-card {
  display: flex;
  flex-direction: row;
  width: 100%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}

.property-image {
  width: 35%;
}

.property-image img {
  width: 100%;
  height: auto;
}

.property-details {
  width: 65%;
  padding: 20px;
}

.property-title {
  font-size: 24px;
  font-weight: bold;
  color: #000;
}

.property-price {
  font-size: 20px;
  font-weight: bold;
  color: #4CAF50;
}

.property-bed-bath,
.property-location,
.property-about,
.property-description,
.property-owned-by,
.property-owner-name,
.property-owner-company,
.amenities-title,
.owner-rating,
.property-rating,
.amenities-list {
  font-size: 16px;
  color: #000;
}

hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
  margin: 20px 0;
}

.property-about, .property-owned-by {
  font-weight: bold;
  color: #000; /* added this line */
}

.property-description {
  margin-bottom: 20px;
  color: #000; /* added this line */
}

.contact-owner-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.amenities-title {
  font-weight: bold;
  color: #000; /* added this line */
}

.amenities-list {
  margin-bottom: 20px;
  color: #000; /* added this line */
}

.rating {
  display: flex;
  justify-content: space-between;
}

div[property] > p {
  color: #000;
}

.remove-property-button {
  background-color: #ff6347; /* Coral color */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
}

.remove-property-button:hover {
  background-color: #ff4838; /* Darker coral color on hover */
}

.amenities-list {
  margin-bottom: 20px;
}

.amenities-list p {
  font-size: 16px;
  color: #000; /* added this line */
}

.amenities-list button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.amenities-list button:hover {
  background-color: #45a049;
}

.edit-property-button {
    background-color: #007bff; /* Blue color */
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-right: 10px; /* Add some right margin for spacing */
    cursor: pointer;
  }

  .edit-property-button:hover {
    background-color: #0056b3; /* Darker blue color on hover */
  }
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
    min-width: 400px;
    background-color: bisque;
  }
  h1 {
    color:black;
    font-weight: 600;
  }
  h2 {
    color:black;
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
    min-width: 400px;
    background-color: bisque;
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
    min-width: 400px;
    background-color: bisque;
    color:black;
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
  .row {
    display: flex;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

.column {
  flex: 50%;
  max-width: 500px;
}
.creviews {
    border-width: 5px;
    border-style: dashed;
    border-color: orange;
    border-radius: 4px;
    width: fit-content;
    height: fit-content;
    margin: 10px;
    padding: 10px;
    min-width: 400px;
    background-color: bisque;
    color:black;
  }

  .into label{
    margin: 10px;
    padding: 10px;
    color: #000;
    font-weight: 600;
  }
  .into button {
    color: #000;
    font-weight: 600;
    cursor: pointer;
  }

  .hoverbox {
    display: none;
    position:absolute;
    width: 25%;
    height: fit-content;
    left: 65%;
    top: 70px;
    justify-self: right;
    background-color: bisque;
    border-width: 5px;
    border-style: dashed;
    border-color: orange;
    border-radius: 4px;
  }
  .hoverbox button {
    background-color: red;
    margin: 5px;
    margin-left: 0px;
    padding: 5px;
    color: white;
    border-radius: 10px;
    float: right;
  }
  .hoverbox h1 {
    display: inline;
    font-size: 26px;
  }

  .hoverbox ul {
    color: purple;
  }

</style> 
