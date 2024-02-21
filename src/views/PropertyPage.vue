<template>
  <div class="property-card" v-if="property">
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
        <!-- <p class="owner-rating">Owner rating: {{ propertyInfo.ownerRating }}</p> -->
        <!-- <p class="property-rating">Property rating: {{ propertyInfo.propertyRating }}</p> -->
      </div>
    </div>
  </div>
  <div v-else>
    <!-- <p>Loading...</p> -->
    <div class="loading-spinner"></div>
  </div>
</template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import {ref} from 'vue';
  import router from '../router/index'
  import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, where, deleteDoc } from 'firebase/firestore/lite'
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

</style> 
