<template>
    <div class="companyRegister">
        <h1 style="color: black;">Create an leasing company account</h1>
        <!-- Create our Register form and prevent submission without necessary data -->
        <form @submit.prevent="companyRegister" class="registrationForm">
            <div class="formGroup">
                <input type="text" placeholder="Email" v-model="email" class="black-text"/>
            </div>
            <div class="formGroup">
                <input type="text" placeholder="Username" v-model="username" class="black-text"/>
            </div>
            <div class="formGroup">
                <input type="password" placeholder="Password" v-model="password" class="black-text"/>
            </div>
            <div class="formGroup">
                <input type="text" placeholder="Phone Contact" v-model="phoneNumber" class="black-text"/>
            </div>
            <div class="formGroup">
                <input type="text" placeholder="Permanent physical address" v-model="permanentAddress" class="black-text"/>
            </div>
            <div class="formGroup">
                <button type="submit" class="submitButton">Register</button>
            </div>
            <p style="color: black;">Have an account? <router-link to="/login">Login Here</router-link></p>
        </form>
    </div>
</template>


<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {ref} from 'vue';
import router from '../router/index'
import { getFirestore, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'

export default {
    /* The setup() function is part of the Composition API in Vue 3 and initializes
        the reactive ref variables 'email' and 'password'. */
    setup() {
        const email = ref("");
        const password = ref("");
        const username = ref("");
        const phoneNumber = ref("");
        const permanentAddress = ref("");
        const db = getFirestore(firebaseapp);

        // Executed on form submission 
        const companyRegister = async () => {
            try {
            const auth = getAuth();
                // Signed up 
                // const user = userCredential.user;
                const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
                const userDocRef = doc(collection(db, 'users'), userCredential.user.uid);
                await setDoc(userDocRef, {
                username: username.value,
                phoneNumber: phoneNumber.value,
                permanentAddress: permanentAddress.value,
                userType: "leasingCompany"
            });
            router.push('/');
            console.log("success with company regiseration");
        } catch(error) {
            console.error("Error registering user:", error.message);
        }
                // return db.collection('users').doc(userCredential.user.uid).set({
                //     username: username.value,
                //     phoneNumber: phoneNumber,
                //     permanentAddress: permanentAddress.value,
                //     userType: "leasingCompany"
                // });
                            // ...
            
            // .catch((error) => {
            //     const errorCode = error.code;
            //     const errorMessage = error.message;
            //     alert(errorMessage);
            //     // ..
            // });
        };

        // Return the necessary attributes needed for authentication
        return {
            companyRegister,
            email,
            password,
            username,
            phoneNumber,
            permanentAddress
        }
    }
}

</script>

<!-- </script> -->

<style>
.companyRegister {
  text-align: center;
  background-color: #ffe0b2; /* Pale shade of orange */
  padding: 20px; /* Add padding for spacing */
}

.black-text {
    color: black;
}

.registrationForm {
  margin-top: 20px;
}

.formGroup {
  margin-bottom: 10px;
}

.textInput {
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submitButton {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submitButton:hover {
  background-color: #0056b3;
}

.companyRegister h1 {
  font-size: 24px; /* Adjust the font size as needed */
}

</style>