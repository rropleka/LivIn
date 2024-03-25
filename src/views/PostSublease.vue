<template>
    <div class="post-sublease-form">
      <h1>Post Sublease</h1>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <form @submit.prevent="postSublease">
        <div class="form-group">
          <label for="sublease-price">Sublease Price ($):</label>
          <input type="number" id="sublease-price" v-model.number="subleasePrice" min="0">
        </div>
  
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="description"></textarea>
        </div>
  
        <div class="form-group">
          <label for="duration">Duration:</label>
          <input type="text" id="duration" v-model="duration">
        </div>
  
        <button type="submit">Post Sublease</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';
  import { firebaseapp } from '../main';  
  import { getAuth } from 'firebase/auth'
import router from '@/router';

  export default {
    data() {
      return {
        errorMessage: '',
        subleasePrice: 0,
        description: '',
        duration: '',
        propertyId: this.$route.params.id,
        propertyObject: NaN
      };
    },
    async mounted() {
      // Fetch property data based on the propertyId (similar to editProperty)
      this.fetchPropertyData(this.propertyId);
      this.fetchExistingSublease(this.propertyId);
    //   this.fetchExistingSublease(this.propertyId);
    },
    beforeUpdate() {
  const auth = getAuth();
  if (auth.currentUser && !this.currentUser) {
    // User has just been authenticated
    this.currentUser = auth.currentUser;
    this.fetchExistingSublease(this.propertyId);
  }
},
    methods: {
      async fetchPropertyData(propertyId) {
        // Implement fetching property data as per your requirements
        try {
        const db = getFirestore(firebaseapp);
        const propertyDocRef = doc(db, 'properties', propertyId);
        const propertyDocSnap = await getDoc(propertyDocRef);

        if (propertyDocSnap.exists()) {
          const data = propertyDocSnap.data();
          console.log("propertyData in sublease", data);
          this.propertyObject = data;
        //   propertyName.value = data.propertyName;
        //   amenities.value = data.amenities;
        //   rent.value = data.rent;
        //   propertySize.value = data.propertySize;
        //   structureDetails.value = data.structureDetails;
        //   location.value = data.location;
        //   ownerUsername.value = data.owner;
        } else {
          console.error('Property document does not exist.');
        }
      } catch (error) {
        console.error('Error fetching property data:', error.message);
      }
      },
      async fetchExistingSublease(propertyId) {
  try {
    const auth = getAuth(); // Get the authentication object
    const currentUser = auth.currentUser; // Get the current user

    if (!currentUser) {
      console.error('User not authenticated.');
      return null;
    }

    const currentUserID = currentUser.uid;
    const userDocRef = doc(getFirestore(firebaseapp), 'users', currentUserID);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.error('User data not found.');
      return null;
    }

    const userData = userDocSnap.data();
    const leaseOwner = userData.username; // Get the username from user data

    const db = getFirestore(firebaseapp);
    const subleasesCollectionRef = collection(db, 'subleases');

    // Check if a sublease already exists for this propertyId and leaseOwner
    const subleaseQuerySnapshot = await getDocs(
      query(subleasesCollectionRef, where('propertyId', '==', propertyId), where('leaseOwner', '==', leaseOwner))
    );

    if (!subleaseQuerySnapshot.empty) {
      // Sublease already exists, return the existing sublease data
      const existingSubleaseData = subleaseQuerySnapshot.docs[0].data();
      if (existingSubleaseData) {
      // Sublease already exists, fill the fields with existing data
      this.subleasePrice = existingSubleaseData.subleasePrice;
      this.description = existingSubleaseData.description;
      this.duration = existingSubleaseData.duration;
    }
    }

    // Sublease does not exist, return null
  } catch (error) {
    console.error('Error fetching existing sublease:', error.message);
  }
},
    async postSublease() {
  this.errorMessage = '';

  // Validate input data
  if (this.subleasePrice <= 0 || !this.description.trim() || !this.duration.trim()) {
    this.errorMessage = 'Please fill in all fields correctly.';
    return;
  }

  try {
    const auth = getAuth(); // Get the authentication object
    const currentUser = auth.currentUser; // Get the current user

    if (!currentUser) {
      this.errorMessage = 'User not authenticated.';
      return;
    }

    const db = getFirestore(firebaseapp);
    const subleasesCollectionRef = collection(db, 'subleases');

    // Fetch the current user's username
    const currentUserID = currentUser.uid;
    const userDocRef = doc(db, 'users', currentUserID);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      this.errorMessage = 'User data not found.';
      return;
    }

    const userData = userDocSnap.data();
    const leaseOwner = userData.username; // Get the username from user data

    console.log("before privacy to Public", userData);

    if (!userData.accountPrivacy) {
      await setDoc(userDocRef, { ...userData, accountPrivacy: 'public' }, { merge: true });
    }

    console.log("after privacy to Public", userData);
    alert("updated privacy to public");

    // Check if a sublease already exists for this propertyId and username
    const subleaseQuerySnapshot = await getDocs(
      query(subleasesCollectionRef, where('propertyId', '==', this.propertyId), where('leaseOwner', '==', leaseOwner))
    );

    if (!subleaseQuerySnapshot.empty) {
      // Sublease already exists, update it
      const subleaseDocSnapshot = subleaseQuerySnapshot.docs[0]; // Assuming only one sublease per propertyId and username

      await setDoc(subleaseDocSnapshot.ref, {
        subleasePrice: this.subleasePrice,
        description: this.description,
        duration: this.duration,
        propertyId: this.propertyId, // Make sure to include the property ID
        propertyName: this.propertyObject.propertyName, // Define these variables
        ownerUsername: this.propertyObject.owner,
        leaseOwner: leaseOwner, // Assign the leaseOwner field
      });

      console.log('Sublease updated successfully.');
    } else {
      // Sublease does not exist, add a new one
      await setDoc(doc(subleasesCollectionRef), {
        subleasePrice: this.subleasePrice,
        description: this.description,
        duration: this.duration,
        propertyId: this.propertyId, // Make sure to include the property ID
        propertyName: this.propertyObject.propertyName, // Define these variables
        ownerUsername: this.propertyObject.owner,
        leaseOwner: leaseOwner, // Assign the leaseOwner field
      });

      console.log('New sublease added successfully.');
    }

    // Optionally, you can redirect to a success page or perform other actions
    const redirectUrl = `/${this.propertyObject.owner}/${this.propertyObject.propertyName}`;
    router.push(redirectUrl);
  } catch (error) {
    console.error('Error posting/subleasing:', error.message);
    this.errorMessage = 'An error occurred while posting/subleasing the property.';
  }
}
    }
  };
  </script>
  
  <style scoped>
.post-sublease-form {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.post-sublease-form h1 {
  color: #007bff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  line-height: 1.2;
}

.post-sublease-form .form-group {
  margin-bottom: 20px;
}

.post-sublease-form label {
  display: block;
  margin-bottom: 5px;
  color: #007bff;
}

.post-sublease-form input[type="number"],
.post-sublease-form input[type="text"],
.post-sublease-form textarea {
  width: calc(100% - 16px);
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #495057; /* Text color */
}

/* Additional styling for text inputs */
.post-sublease-form input[type="text"] {
  /* Add your additional styling properties here */
}

.post-sublease-form .error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 20px;
}

.post-sublease-form button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.post-sublease-form button:hover {
  background-color: #0056b3;
}
</style>
  