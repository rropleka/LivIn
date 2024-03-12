<template>
    <div class="login">

        <h1 style="color: black;">Login</h1>
        <form @submit.prevent="login">
            <input type="text" placeholder="Email" v-model="email" class="black-text"/>
            <input type="password" placeholder="Password" v-model="password" class="black-text"/>
            <button type="submit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Login</button>
            <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Need an account? <router-link to="/register">Register Here</router-link></p>
            <p class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Need a Leasing Company account? <router-link to="/company-register">Register Here</router-link></p>
        </form>

    </div>
</template>

<script>
    import { ref } from 'vue';
    import router from '../router/index'
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
    import { useStore } from "vuex";
    import { getFirestore, collection, doc, getDoc } from 'firebase/firestore/lite'
    import { firebaseapp } from '../firebaseInit'

    export default {
        setup() {
            const store = useStore();
            const email = ref("");
            const password = ref("");

            const login = () => {
                const auth = getAuth();
                signInWithEmailAndPassword(auth, email.value, password.value)
                    .then(async (userCredential) => {
                        // Get the user info from the database
                        const db = getFirestore(firebaseapp)
                        const userDocRef = doc(collection(db, 'users'), userCredential.user.uid);
                        const userDoc = await getDoc(userDocRef);
                        // Signed in, update the user info in the store
                        const user ={
                            uid: userCredential.user.uid,
                            email: userCredential.user.email,
                            password: userCredential.user.password,
                            username: userDoc.data().username,
                            name: userDoc.data().name,
                            age: userDoc.data().age,
                            gender: userDoc.data().gender,
                            class: userDoc.data().class,
                            aboutme: userDoc.data().aboutme,
                            contactinfo: userDoc.data().contactinfo
                        };
                        // Dispatch the loginUser action to update the store
                        store.dispatch('loginUser', user);
                        // ...
                        router.push('/');
                    })
                    .catch((error) => {
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