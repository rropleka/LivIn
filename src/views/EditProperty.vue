<template>
    <div class="property-form">
      <h1>Edit Property</h1>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <form @submit.prevent="updateProperty">
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
          <input type="number" id="rent" v-model.number="rent" min="0">
        </div>
  
        <div class="form-group">
          <label for="property-size">Property Size: (in acres)</label>
          <input type="text" id="property-size" v-model="propertySize" pattern="[0-9]*">
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
  
        <button type="submit">Update Property</button>
      </form>
    </div>
  </template>
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import {ref} from 'vue';
  import router from '../router/index'
  import { getFirestore, collection, doc, getDoc, getDocs, setDoc, query, where, updateDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
  
  export default {
    mounted() {
    const propertyId = this.$route.params.id;
    this.propertyId = propertyId;
    console.log('Property ID:', propertyId);
    this.fetchPropertyData(propertyId);
  },
    setup() {
      const propertyName = ref('');
      const amenities = ref([]);
      const newAmenity = ref('');
      const rent = ref(0);
      const propertySize = ref('');
      const structureDetails = ref('');
      const location = ref('');
      const propertyId = ref('');
      const errorMessage = ref('');
      const ownerUsername = ref('');
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

    // Fetch property data based on the propertyId
    const fetchPropertyData = async (propertyId) => {
      try {
        const propertyDocRef = doc(db, 'properties', propertyId);
        const propertyDocSnap = await getDoc(propertyDocRef);

        if (propertyDocSnap.exists()) {
          const data = propertyDocSnap.data();
          propertyName.value = data.propertyName;
          amenities.value = data.amenities;
          rent.value = data.rent;
          propertySize.value = data.propertySize;
          structureDetails.value = data.structureDetails;
          location.value = data.location;
          ownerUsername.value = data.owner;
        } else {
          console.error('Property document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching property data:', error.message);
      }
    };
  
    const updateProperty = async () => {
          errorMessage.value = '';
            try {
              if (!propertyName.value.trim()) {
                    errorMessage.value = 'Property name cannot be empty';
                    return;
                }

                if (amenities.value.length === 0) {
                    errorMessage.value = 'At least one amenity must be added';
                    return;
                }

                if (rent.value <= 0) {
                    errorMessage.value = 'Rent must be a positive number';
                    return;
                }

                if (!propertySize.value.trim()) {
                    errorMessage.value = 'Property size cannot be empty';
                    return;
                }

                if (!structureDetails.value.trim()) {
                    errorMessage.value = 'Structure details cannot be empty';
                    return;
                }

                if (!location.value.trim()) {
                    errorMessage.value = 'Location cannot be empty';
                    return;
                }
          console.log("id val :", propertyId.value);

          // Check if the property with the same name and owner already exists
        const propertyExistsQuerySnapshot = await getDocs(query(collection(db, 'properties'), 
            where("propertyName", "==", propertyName.value),
            where("owner", "==", ownerUsername.value)));

        if (!propertyExistsQuerySnapshot.empty) {
            errorMessage.value = "A property with the same name already exists for this owner.";
            return;
        }


          const propertyDocRef = doc(db, 'properties', propertyId.value);
          if (typeof rent.value !== 'undefined' && rent.value !== null) {
            console.log("within");
            await updateDoc(propertyDocRef, {
                propertyName: propertyName.value,
                amenities: amenities.value.map(amenity => amenity.trim()),
                rent: rent.value,
                propertySize: propertySize.value,
                structureDetails: structureDetails.value,
                location: location.value
            });
          }
          console.log('Property updated successfully.');
          const updatedName = propertyName.value;
          const redirectUrl = `/${ownerUsername.value}/${updatedName}`;
          router.push(redirectUrl);
          // TODO: Redirect to property details page or other appropriate page
        } catch (error) {
          console.error('Error updating property:', error.message);
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
        updateProperty,
        searchLocation,
        fetchPropertyData,
        propertyId,
        errorMessage,
        ownerUsername
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

.property-form .error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 20px;
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
