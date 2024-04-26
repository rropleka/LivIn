<template>
    <div class="property-form">
      <h1>Add New Property</h1>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <form @submit.prevent="saveProperty">
        <div class="form-group">
          <label for="property-name">Property Name:</label>
          <input type="text" id="property-name" v-model="propertyName">
        </div>

        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" placeholder="e.g. 11111 Sample St, West Lafayette, IN, 47907" id="address" v-model="address1">
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
          <label for="structure-details">Property Details:</label>
          <textarea id="structure-details" v-model="structureDetails"></textarea>
        </div>
  
        <!-- <div class="form-group"> -->
          <!-- <label for="location">Location:</label> -->
          <!-- <input type="text" id="location" placeholder="Search Location" v-model="location" @keyup.enter="searchLocation"> -->
          <!-- <input type="text" id="location" placeholder="Store Location" v-model="location" @focus="initAutocomplete"> -->
        <!-- </div> -->
  
        <!-- <div class="map-container"> -->
          <!-- Map display area -->
          <!-- <GoogleMap api-key="AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8" style="width: 100%; height: 300px" :center="mapCenter" :zoom="15"> -->
          <!-- <Marker :position="mapCenter"></Marker> -->
        <!-- </GoogleMap> -->
          <!-- <div id="map"></div> -->


          <div class="form-group">
            <label for="map-type">Select Map Type:</label>
  <div class="radio-buttons">
    <label>
      <input type="radio" v-model="selectedMapType" value="gmap">
      Google Maps
    </label>
    <label>
      <input type="radio" v-model="selectedMapType" value="leaflet">
      Leaflet Maps
    </label>
  </div>
    </div>


          <div v-if="selectedMapType === 'gmap'" class="map">
            <div>
    <label for="autocomplete-input">Location:</label>
    <input type="text" id="autocomplete-input" v-model="location" @input="onInputChange">
  </div>

            <GMapItem />
          </div>
          <div v-else>
  <!-- <div> -->
  <!-- <label for="autocomplete-input">Location:</label> -->
  <!-- <Autocomplete
    id="autocomplete-input"
    v-model="location"
    :options="autocompleteOptions"
    @place_changed="onPlaceChanged"
  /> -->
<!-- </div> -->

<vue-google-autocomplete
      ref="address"
      id="map"
      classname="form-control"
      placeholder="Please type your address"
      v-on:placechanged="onPlaceChanged"
      country="us"
    >
    </vue-google-autocomplete>
    </div>
          <!-- <GoogleMap 
    api-key="AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8" 
    :style=style 
    :center="center" 
    @click="onMapClick"
    @contextmenu="onMapRightClick"
    :zoom="15">

    <div class="hotspotMarker" v-for="hotspot in hotspots" :key="hotspot.position">
      <Marker :options="hotspot"/>
    </div>
    
    <Marker :options="marker1options" />
    <Marker :options="marker2options" />
    <Polyline v-if="renderPolyline" :options="polylineOptions"/>

  </GoogleMap> -->
        <!-- </div> -->
  
        <button type="submit">Save Property</button>
        <!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8&libraries=places"></script> -->
        <!-- <head><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8&libraries=places"></script></head> -->
      </form>
    </div>
  </template>

  <!-- <script setup>
  import GMapItem from '@/components/GMapItem2.vue';

  </script> -->
  
  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import {ref} from 'vue';
  import router from '../router/index'
  import { getFirestore, collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import { GoogleMap, Marker } from "vue3-google-map";
import GMapItem from '@/components/GMapItem2.vue';
// import { GMapAutocomplete } from 'vue3-google-autocomplete';
import VueGoogleAutocomplete from "vue-google-autocomplete";





  
  export default {
    async mounted() {
      // this.$refs.address.focus()
      // this.initAutocomplete();
  
    const auth = getAuth();
  const currentUser = auth.currentUser;

  // If the user is not logged in, redirect to the login page
  if (!currentUser) {
    // router.push({ name: 'login' });
    return;
  }
  const currentUserID = auth.currentUser.uid;
  const db = getFirestore(firebaseapp);
  try {
        const userDocRef = doc(db, 'users', currentUserID);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log(userData);
          if (userData.userType) {
              if(userData.userType == "sitemoderator") {
                router.push({ name: 'login' });
                alert("only leasing companies can add properties")
                return;
              }
        } else {
            router.push({ name: 'login' });
            alert("only leasing companies can add properties")
            return;
        }
        } else {
          console.error('User data does not exist.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
},
components: {
      GMapItem, // Register GMapItem as a component
      // Autocomplete,
      VueGoogleAutocomplete
    },
    data() {
      return {
        center: { lat: 40.420781, lng: -86.918061 },
        location: '',
        selectedMapType: 'gmap',
        // locationCoordinates: '',
        autocompleteOptions: {
      types: ['geocode'], // specify the type of results (optional)
    },
    address: "",
        point1: null,
        point2: null,
        polylineString: '',
        renderPolyline: false,
        formattedTravelTimes: [0, 0, 0],
        renderTravelTimes: false,
        errorMessage: '',
        amenities: [],
        newAmenity: '',
        rent: 0,
        propertySize: '',
        structureDetails: '',
        autocomplete: null,
      };
    },
    methods: {
      getAddressData: function (addressData, placeResultData, id) {
        this.address = addressData;
      },
      onPlaceChanged(place) {
        console.log('Selected Place:', place);

// Check if place.geometry exists and has location information
if (place.latitude && place.longitude) {
  const lat = place.latitude;
  const lng = place.longitude
  // const formattedLocation = place.formatted_address;
  console.log('Coordinates:', { lat, lng });
  this.locationCoordinates = `(${lat}, ${lng})`;
  // console.log('Formatted Location:', formattedLocation);

  // You can now use the lat, lng, and formattedLocation variables as needed
} else {
  console.error('Error retrieving place details.');
}
  },
      onInputChange() {
      // Handle input change if needed
    },
    // onPlaceChanged() {
    //   const place = this.autocomplete.getPlace();
    //   if (!place.geometry) {
    //     console.error('Place details not found for the input.');
    //     return;
    //   }
    //   // Handle selected place, e.g., update location data
    //   this.location = place.formatted_address;
    //   // You can also access other place properties like place.geometry.location
    // },
    initAutocomplete() {
      // Initialize autocomplete and bind it to the input field
      const inputElement = document.getElementById('autocomplete-input');
      this.autocomplete = new google.maps.places.Autocomplete(inputElement, {
        types: ['geocode'], // Specify the type of place data to return
      });

      // Listen for the 'place_changed' event to handle selected place
      this.autocomplete.addListener('place_changed', this.onPlaceChanged);
    },
    // initAutocomplete() {
    //   const inputElement = document.getElementById('location');
    //   this.autocomplete = new google.maps.places.Autocomplete(inputElement, {
    //     types: ['geocode'],
    //   });

    //   // Listen for the 'place_changed' event to retrieve the selected place
    //   this.autocomplete.addListener('place_changed', this.placeChanged);
    // },
    placeChanged() {
      const place = this.autocomplete.getPlace();
      if (!place.geometry) {
        console.error('Place details not found for the input.');
        return;
      }
      this.location = place.formatted_address;
      // You can also access other properties like place.geometry.location to get the coordinates
    },
  },
    setup() {
      const locationCoordinates = ref('');
      const selectedMapType = ref('gmap');
      const propertyName = ref('');
      const address1 = ref('');
      const amenities = ref([]);
      const newAmenity = ref('');
      const rent = ref(0);
      const propertySize = ref('');
      const structureDetails = ref('');
      const location = ref('');
      const errorMessage = ref('');
      const db = getFirestore(firebaseapp);
  
      const addAmenity = () => {
        console.log("adding amenity");
        if (newAmenity.value.trim() !== '') {
          amenities.value.push(newAmenity.value);
          newAmenity.value = '';
        }
      };

      const removeAmenity = (index) => {
        amenities.value.splice(index, 1);
    };

    // const initAutocomplete = () => {
    // const inputElement = document.getElementById('location');
    // const autocomplete = new google.maps.places.Autocomplete(inputElement);

    // // Set options for the Autocomplete service (if needed)
    // autocomplete.setFields(['formatted_address', 'geometry']);

    // // Listen for the 'place_changed' event to retrieve the selected place
    // autocomplete.addListener('place_changed', () => {
    //   const place = autocomplete.getPlace();

    //   if (!place.geometry) {
    //     // Place details not found for the input.
    //     return;
    //   }

    //   // Update the location value with the formatted address
    //   location.value = place.formatted_address;

    //   // You can also access other properties like place.geometry.location to get the coordinates
    // });
    // }
      const saveProperty = async () => {
        errorMessage.value = '';
            try {
              if (!propertyName.value.trim()) {
                    errorMessage.value = 'Property name cannot be empty';
                    return;
                }

                if (!address1.value.trim()) {
                    errorMessage.value = 'Address cannot be empty';
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
                    errorMessage.value = 'Property details cannot be empty';
                    return;
                }

                if (!location.value.trim() && selectedMapType.value === 'gmap' ) {
                    errorMessage.value = 'Location cannot be empty';
                    return;
                }

                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    errorMessage.value = 'User not authenticated.';
                    return;
                }
                console.log(user);
                if (!user) {
                  errorMessage.value = 'User not authenticated.';
                    return;
                    // throw new Error('User not authenticated.');
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
                errorMessage.value = 'Error fetching username!';
                return;
                // throw new error("Error fetching username.")
              }

              // Check if a property with the same name and owner already exists
              const propertyExistsQuerySnapshot = await getDocs(query(collection(db, 'properties'), 
                  where("propertyName", "==", propertyName.value),
                  where("owner", "==", username)));

              if (!propertyExistsQuerySnapshot.empty) {
                  errorMessage.value = "A property with the same name already exists for this owner.";
                  return;
              }

                const propertyDocRef = doc(collection(db, 'properties'));
                console.log("sdaasdasd");
                console.log("locationCoordinates:", locationCoordinates.value);
                if (selectedMapType.value !== 'gmap') {
            // Assign locationCoordinates if selectedType is not equal to 'gmap'
            await setDoc(propertyDocRef, {
                propertyName: propertyName.value,
                address: address1.value,
                amenities: amenities.value.map(amenity => amenity.trim()),
                rent: rent.value,
                propertySize: propertySize.value,
                structureDetails: structureDetails.value,
                location: locationCoordinates.value,
                owner: username,
                subleaseCount: 0
            });
        } else {
                await setDoc(propertyDocRef, {
                propertyName: propertyName.value,
                address: address1.value,
                amenities: amenities.value.map(amenity => amenity.trim()),
                rent: rent.value,
                propertySize: propertySize.value,
                structureDetails: structureDetails.value,
                location: location.value,
                owner: username,
                subleaseCount: 0
            });
          }
            router.push('/');
            console.log("Property saved successfully.");
        } catch(error) {
            console.error("Error saving property:", error.message);
        }
      };
  
      // const searchLocation = async () => {
      //   // Implement location search using autocomplete
      //   // Update map marker position accordingly
      //   try {
      //   // Use the Google Maps Geocoding API to convert location into coordinates
      //   const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location.value}&key=AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8`);
      //   const data = await response.json();
      //   console.log(data);
      //   const coordinates = data.results[0].geometry.location;
      //   mapCenter.value = { lat: coordinates.lat, lng: coordinates.lng };
      // } catch (error) {
      //   console.error('Error searching location:', error.message);
      // }
      // };
  
      return {
        selectedMapType,
        propertyName,
        address1,
        amenities,
        newAmenity,
        rent,
        propertySize,
        structureDetails,
        location,
        addAmenity,
        removeAmenity,
        saveProperty,
        // searchLocation,
        errorMessage,
        locationCoordinates,
        // mapCenter,
        // initAutocomplete
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

.property-form .error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 20px;
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

.radio-buttons {
  display: flex;
  gap: 10px; /* Adjust the spacing between radio buttons */
}

.radio-buttons label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-buttons input[type="radio"] {
  appearance: none; /* Remove default radio button appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px; /* Adjust the size of the custom radio button */
  height: 20px;
  border: 2px solid #007bff; /* Define border color */
  border-radius: 50%; /* Create a circular shape */
  margin-right: 5px; /* Adjust spacing between radio button and label */
  outline: none; /* Remove focus outline */
}

.radio-buttons input[type="radio"]:checked {
  background-color: #007bff; /* Change background color when checked */
}

.radio-buttons label span {
  color: #333; /* Define label text color */
}
</style> 
