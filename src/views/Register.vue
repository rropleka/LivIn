<template>
    <div class="register">
        <h1 style="color: black;">Register</h1>
        <!-- Create our Register form and prevent submission without necessary data -->
        <form @submit.prevent="register">
            <input type="text" placeholder="Email" v-model="email" class="black-text"/>
            <input type="password" placeholder="Password" v-model="password" class="black-text"/>
            <input type="text" placeholder="Username" v-model="username" class="black-text"/>
            <button type="submit">Register</button>
            <p style="color: black;">Have an account? <router-link to="/login">Login Here</router-link></p>
        </form>
    </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ref } from 'vue';
import router from '../router/index'
import { useStore } from "vuex";
// IMPORT getFirestore and firebaseapp everywhere you want to access the database
import { getFirestore, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../firebaseInit'
import registerView from "@/components/register-view.vue";

export default {
    /* The setup() function is part of the Composition API in Vue 3 and initializes
        the reactive ref variables 'email' and 'password'. */
        
    setup() {
        const email = ref("");
        const password = ref("");
        const username = ref("");
        const store = useStore();
        // !!! Add this line to get the instance of firestore in each location of the app its needed !!!
        const db = getFirestore(firebaseapp)

        const page = ref(1)

        // Executed on form submission 
        const register = async () => {
            // Validation: Check if the username length is between 8-20 characters
            if (username.value.length < 8 || username.value.length > 20) {
                alert("Username must be between 8-20 characters.");
                return; // Prevent form submission
            }

            // Create auth reference to signup new users with firebase
            const auth = getAuth();

            try {
                // Check if the username already exists in the database
                const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username.value)));

                if (!querySnapshot.empty) {
                    // Username already exists, inform the user and prevent registration
                    alert("Username already exists. Please choose a different username.");
                    return;
                }

            
            /* FIREBASE USER CREATION */
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            // Send email verification
            await sendEmailVerification(auth.currentUser);
            alert("Check email for verification link");
            console.log("Verification email sent!");

            // Create a userDocRef to give each user a unique doc in our users collection
            const userDocRef = doc(collection(db, 'users'), userCredential.user.uid);
            await setDoc(userDocRef, {
                username: username.value // Add username to firestore associated with uid
            });

            const user = userCredential.user;
            store.dispatch('loginUser', user);

            // Redirect to the home page after successful registration
                router.push('/');
            } catch(error) {
                // Handle any errors
                const errorMessage = error.message;
                alert(errorMessage);
            }
};

        // Return the necessary attributes needed for authentication
        return {
            page,
            register,
            email,
            username,
            password
        }
    }
}

</script>

  <style>
  @media (min-width: 1024px) {
    .register {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  .black-text {
      color: black;
  }

  </style>