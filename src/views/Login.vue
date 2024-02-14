<template>
    <div class="login">

        <h1 style="color: black;">Login</h1>
        <form @submit.prevent="login">
            <input type="text" placeholder="Email" v-model="email"/>
            <input type="password" placeholder="Password" v-model="password"/>
            <button type="submit">Login</button>
            <p style="color: black;">Need an account? <router-link to="/register">Register Here</router-link></p>
        </form>

    </div>
</template>

<script>
    import { ref } from 'vue';
    import router from '../router/index'
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
    import { useStore } from "vuex";

    export default {
        setup() {
            const store = useStore();
            const email = ref("");
            const password = ref("");

            const login = () => {
                const auth = getAuth();
                signInWithEmailAndPassword(auth, email.value, password.value)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        // Dispatch the loginUser action to update the store
                        store.dispatch('loginUser', user);
                        // ...
                        router.push('/');
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        alert(errorMessage);
                    });

            }

            return {
                login,
                email,
                password
            }
        }
    }
</script>

  <style>
  @media (min-width: 1024px) {
    .login {
      min-height: 100vh;
      display: flex;
      align-items: center;
      color: black;
    }
  }
  </style>
  