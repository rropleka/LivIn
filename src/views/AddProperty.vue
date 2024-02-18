<template>
    <div class="property-form">
      <h1>Add New Property</h1>
      <form @submit.prevent="saveProperty">
        <div class="form-group">
          <label for="property-name">Property Name:</label>
          <input type="text" id="property-name" v-model="propertyName">
        </div>
  
        <div class="form-group">
    <label for="amenities">Amenities:</label>
    <ul id="amenities">
        <li v-for="(amenity, index) in amenities" :key="index">
            <span class="amenity-name">{{ amenity }}</span>
            <button type="button" @click="removeAmenity(index)" class="remove-button">×</button>
        </li>
    </ul>
    <input type="text" placeholder="Add Amenity" v-model="newAmenity">
    <button type="button" @click="addAmenity">Add Amenity</button>
</div>
  
        <div class="form-group">
          <label for="rent">Rent per Month ($):</label>
          <input type="number" id="rent" v-model.number="rent">
        </div>
  
        <div class="form-group">
          <label for="property-size">Property Size:</label>
          <input type="text" id="property-size" v-model="propertySize">
        </div>
  
        <div class="form-group">
          <label for="structure-details">Structure Details:</label>
          <textarea id="structure-details" v-model="structureDetails"></textarea>
        </div>
  
        <div class="form-group">
          <label for="location">Location:</label>
          <input type="text" id="location" placeholder="Search Location" v-model="location" @keyup.enter="searchLocation">
        </div>
  
        <div class="map-container">
          <!-- Map display area -->
          <div id="map"></div>
        </div>
  
        <button type="submit">Save Property</button>
      </form>
    </div>
  </template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import {ref} from 'vue';
  import router from '../router/index'
  import { getFirestore, collection, doc, getDoc, setDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
  
  export default {
    setup() {
      const propertyName = ref('');
      const amenities = ref([]);
      const newAmenity = ref('');
      const rent = ref(0);
      const propertySize = ref('');
      const structureDetails = ref('');
      const location = ref('');
      const db = getFirestore(firebaseapp);
  
      const addAmenity = () => {
        if (newAmenity.value.trim() !== '') {
          amenities.value.push(newAmenity.value);
          newAmenity.value = '';
        }
      };

      const removeAmenity = (index) => {
        amenities.value.splice(index, 1);
    };
  
      const saveProperty = async () => {
            try {
            const auth = getAuth();
                const user = auth.currentUser;
                console.log(user);
                if (!user) {
                    throw new Error('User not authenticated.');
                }
                let username = "";
                if (user) {
                  const userId = user.uid;
                  const userDocRef = doc(collection(db, 'users'), userId);

                  try {
                      const userDocSnapshot = await getDoc(userDocRef);
                      console.log(userDocSnapshot)
                      if (userDocSnapshot.exists()) {
                          const userData = userDocSnapshot.data();
                          username = userData.username;
                          console.log("Username:", username);
                      } else {
                          console.log("User document does not exist");
                      }
                  } catch (error) {
                      console.error("Error getting user document:", error.message);
                  }
              } else {
                  console.log("User not authenticated.");
              }
              if(!username) {
                console.log("Error fetching username!");
                throw new error("Error fetching username.")
              }

                const propertyDocRef = doc(collection(db, 'properties'));
                await setDoc(propertyDocRef, {
                propertyName: propertyName.value,
                amenities: amenities.value.map(amenity => amenity.trim()),
                rent: rent.value,
                propertySize: propertySize.value,
                structureDetails: structureDetails.value,
                location: location.value,
                owner: username,
            });
            router.push('/');
            console.log("Property saved successfully.");
        } catch(error) {
            console.error("Error saving property:", error.message);
        }
      };
  
      const searchLocation = () => {
        // Implement location search using autocomplete
        // Update map marker position accordingly
      };
  
      return {
        propertyName,
        amenities,
        newAmenity,
        rent,
        propertySize,
        structureDetails,
        location,
        addAmenity,
        removeAmenity,
        saveProperty,
        searchLocation
      };
    }
  }
  </script>
  
  <style scoped>
body {
  background-color: #f5f5f5; /* Change the background color to match the form background */
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
  margin: 0;
  padding: 0;
}

.property-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Add a subtle box-shadow */
}

.property-form h1 {
  color: #007bff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em; /* Increase the font size */
  line-height: 1.2; /* Adjust the line height for better spacing */
}

.property-form form {
  display: flex;
  flex-direction: column;
}

.property-form fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.property-form legend {
  padding: 0 10px;
  font-size: 1.2em;
  font-weight: bold;
  background-color: #f5f5f5;
  border-left: 4px solid #007bff;
  padding-left: 10px;
}

.property-form .form-group {
  margin-bottom: 20px;
}

.property-form label {
  display: block;
  margin-bottom: 5px;
  color: #007bff; /* Change the color to match the orange navbar */
}

.property-form input[type="text"],
.property-form input[type="number"],
.property-form textarea {
  width: calc(100% - 16px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: black;
}

.property-form ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.property-form ul li {
  margin-bottom: 5px;
}

.property-form button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

.property-form button:hover {
  background-color: #0056b3;
}

.map-container {
  margin-top: 20px;
  width: calc(100% - 16px);
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.amenity-name {
    color: black;
    margin-right: 5px;
}

.remove-button {
    background: none;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
}
</style> 
