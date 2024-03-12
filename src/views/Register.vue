<template>
    <div>
        <h1 style="color: black;">Register</h1>
        <div v-if="page === 1" class="register">
            <!-- Create our Register form and prevent submission without necessary data -->
            <form @submit.prevent="next">
                <input type="text" placeholder="Email" v-model="email" class="black-text"/>
                <input type="password" placeholder="Password" v-model="password" class="black-text"/>
                <input type="text" placeholder="Username" v-model="username" class="black-text"/>
                <button type="submit">Next</button>
            </form>
        </div>
        <div v-else-if="page === 2" class="register">
            <form @submit.prevent="register">
                <input type="text" placeholder="Name" v-model="name" class="black-text" required/>
                <input type="number" placeholder="Age" v-model="age" class="black-text" required/>
                <input type="text" placeholder="Gender" v-model="gender" class="black-text" required/>
                <input type="number" placeholder="Year" v-model="year" class="black-text" required/>
                <textarea type="text" placeholder="About Me" v-model="aboutme" class="black-text" required></textarea>
                <textarea type="text" placeholder="Contact Info" v-model="contactinfo" class="black-text" required></textarea>
                <button type="submit">Register</button>
            </form>
        </div>
        <p style="color: black;">Have an account? <router-link to="/login">Login Here</router-link></p>
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

export default {
    /* The setup() function is part of the Composition API in Vue 3 and initializes
        the reactive ref variables 'email' and 'password'. */
    setup() {
        const page = ref(1);

        const email = ref("");
        const password = ref("");
        const username = ref("");
        const store = useStore();
        // !!! Add this line to get the instance of firestore in each location of the app its needed !!!
        const db = getFirestore(firebaseapp)

        // vars for the user info register form
        const name = ref("");
        const age = ref("");
        const gender = ref("");
        const year = ref("");
        const aboutme = ref("");
        const contactinfo = ref("");

        const next = async () => {
            // Validation: Check if the username length is between 8-20 characters
            if (username.value.length < 8 || username.value.length > 20) {
                alert("Username must be between 8-20 characters.");
                return; // Prevent form submission
            }
            
            try {
                // Check if the username already exists in the database
                const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username.value)));
                
                if (!querySnapshot.empty) {
                    // Username already exists, inform the user and prevent registration
                    alert("Username already exists. Please choose a different username.");
                    return;
                }
                
                page.value = 2;
            } catch (error) {
                console.error("Error checking username:", error);
            }
        }

        // Executed on form submission 
        const register = async () => {
            // Create auth reference to signup new users with firebase
            const auth = getAuth();

            try {
                /* FIREBASE USER CREATION */
                const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
                // Send email verification
                await sendEmailVerification(auth.currentUser);
                alert("Check email for verification link");
                console.log("Verification email sent!");

                // Create a userDocRef to give each user a unique doc in our users collection
                const userDocRef = doc(collection(db, 'users'), userCredential.user.uid);
                await setDoc(userDocRef, {
                    username: username.value, // Add username to firestore associated with uid
                    name: name.value,
                    age: age.value,
                    gender: gender.value,
                    class: year.value,
                    aboutme: aboutme.value,
                    contactinfo: contactinfo.value
                });

                const user ={
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    password: userCredential.user.password,
                    username: username.value,
                    name: name.value,
                    age: age.value,
                    gender: gender.value,
                    class: year.value,
                    aboutme: aboutme.value,
                    contactinfo: contactinfo.value
                };
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
            next,
            register,
            email,
            username,
            password,
            name,
            age,
            gender,
            year,
            aboutme,
            contactinfo,
            page
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