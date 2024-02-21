<template>
    <div class="companyRegister">
        <h1 style="color: black;">Create an leasing company account</h1>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
        const errorMessage = ref("");
        const db = getFirestore(firebaseapp);

        // Executed on form submission 
        const companyRegister = async () => {
            if (!email.value || !password.value || !username.value || !phoneNumber.value || !permanentAddress.value) {
                errorMessage.value = "All fields are required.";
                return;
            }

            if (phoneNumber.value.length < 10) {
                errorMessage.value = "Phone number must be at least 10 digits long.";
                return;
            }
            try {
            const auth = getAuth();

            const usernameExistsQuerySnapshot = await getDocs(query(collection(db, 'users'), where("username", "==", username.value)));
            if (!usernameExistsQuerySnapshot.empty) {
                errorMessage.value = "Username already exists. Please choose a different one.";
                return;
            }
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
            router.push('/login');
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
            permanentAddress,
            errorMessage
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

.error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 20px;
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