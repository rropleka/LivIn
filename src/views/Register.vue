<template>
    <div class="max-w-md mx-auto center-top flex flex-col rounded-3xl bg-orange-300">
        <h1 class="max-w-sm mx-auto py-6 text-white font-default-font text-4xl">Register</h1>
        <div v-if="page === 1">
            <!-- Create our Register form and prevent submission without necessary data -->
            <form @submit.prevent="next" class="max-w-sm mx-auto max-h-md">
                <div class="mb-6">
                    <label for="email" class="block mb-2 text-sm font-medium text-white">Email</label>
                    <input type="text" placeholder="Email" v-model="email" id="email" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"/>
                </div>
                <div class="mb-6">
                    <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                    <input type="password" placeholder="Password" v-model="password" id="password" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"/>
                </div>
                <div class="mb-6">
                    <label for="username" class="block mb-2 text-sm font-medium text-white">Username</label>
                    <input type="text" placeholder="Username" v-model="username" id="username" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"/>
                </div>
                <div class="grid justify-items-center pt-3">
                    <button type="submit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Next</button>
                </div>
            </form>
        </div>
        <div v-else-if="page === 2" >
            <form @submit.prevent="register" class="max-w-sm mx-auto max-h-96 overflow-auto">
                <div class="mb-6">
                    <label for="name" class="block mb-2 text-sm font-medium text-white">Name</label>
                    <input type="text" placeholder="Name" v-model="name" id="name" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" required/>
                </div>
                <div class="mb-6">
                    <label for="age" class="block mb-2 text-sm font-medium text-white">Age</label>
                    <input type="number" placeholder="Age" v-model="age" id="age" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" required/>
                </div>
                <div class="mb-6"> 
                    <label for="gender" class="block mb-2 text-sm font-medium text-white">Name</label>
                    <input type="text" placeholder="Gender" v-model="gender" id="gender" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" required/>
                </div>
                <div class="mb-6">
                    <label for="year" class="block mb-2 text-sm font-medium text-white">Year</label>
                    <input type="number" placeholder="Year" v-model="year" id="year" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" required/>
                </div>
                <div class="mb-6">
                    <label for="aboutme" class="block mb-2 text-sm font-medium text-white">About Me</label>
                    <textarea type="text" placeholder="About Me" v-model="aboutme" id="aboutme" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" required></textarea>
                </div>
                <div class="mb-6">
                    <label for="contactinfo" class="block mb-2 text-sm font-medium text-white">Contact Info</label>
                    <textarea type="text" placeholder="Contact Info" v-model="contactinfo" id="contactinfo" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300" required></textarea>
                </div>
                <div class="grid justify-items-center pt-3">
                    <button type="submit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Register</button>
                </div>
            </form>
        </div>
        <p class="max-w-sm mx-auto py-5 text-white">Have an account? <router-link to="/login">Login Here</router-link></p>
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
.center-top {
    margin-top: 8%;
}
</style>
