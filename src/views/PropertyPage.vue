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
  <div class="score">
    <h1>Cumulative Scores</h1>
    
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
      <div class="leaveRev">
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
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import {ref} from 'vue';
  import router from '../router/index'
  import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, where } from 'firebase/firestore/lite'
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
        hasLoaded:false
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
            const username=currentUser.name
            const ownername=this.leasingCompany
                
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
            console.log("qsempty" + querySnapshot.empty)
            this.loadPack.hasLoaded=!querySnapshot.empty

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
                ${data.reviewText} <br>
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
          console.error('Property document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching property data:', error.message);
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
    });
  }

  // delete using property id
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
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const propname=this.propertyName//replace with current property
            const username=currentUser.name
            const ownername=this.leasingCompany
            if(typeof this.form.stars!='undefined' && this.form.stars) {
              //console.log(this.form.stars)
              const db = getFirestore(firebaseapp)
              try {
                if(this.loadPack.usersReviewed&&this.loadPack.usersReviewed.length>0) { 
                  this.loadPack.usersReviewed.push(username)
                } else {
                  this.loadPack.usersReviewed=[username]
                }
                console.log("andrew here 1")
                const x = doc(db, this.loadPack.docRef)
                console.log("andrew here 2")
                const sr = this.submitReview(db, propname, ownername, username) //push to reviews
                console.log("andrew here 3: " + sr)
                this.updateProperty(db, propname, ownername, x) //update property info
                console.log("andrew here 4")
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
          async submitReview (db, propname, ownername, username){
            const db2 = getFirestore(firebaseapp)
            console.log("db2 type " + typeof db2)
            const docRef = await addDoc(collection(db2, "propertyReviews"), {
              owner: ownername,
              propertyName: propname,
              username: username,
              reviewText: this.form.text,
              stars: this.form.stars,
              timestamp: Date.now()
            }).then((value) => {return value});
            return docRef
          }, 
          async updateProperty (db, propname, ownername, userDocRef) {
            console.log("in update" + userDocRef)
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

</style> 
