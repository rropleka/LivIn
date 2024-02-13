<template>
    <div class="register">
        <h1 style="color: black;">Register</h1>
        <!-- Create our Register form and prevent submission without necessary data -->
        <form @submit.prevent="register">
            <input type="text" placeholder="Email" v-model="email"/>
            <input type="password" placeholder="Password" v-model="password"/>
            <button type="submit">Register</button>
            <p style="color: black;">Have an account? <router-link to="/login">Login Here</router-link></p>
        </form>
    </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {ref} from 'vue';
import router from '../router/index'

export default {
    /* The setup() function is part of the Composition API in Vue 3 and initializes
        the reactive ref variables 'email' and 'password'. */
    setup() {
        const email = ref("");
        const password = ref("");

        // Executed on form submission 
        const register = () => {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                router.push('/');
                            // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                // ..
            });
        };

        // Return the necessary attributes needed for authentication
        return {
            register,
            email,
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
  </style>
  ../router/router