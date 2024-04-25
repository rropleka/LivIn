<template>
    <div class="max-w-md mx-auto center-top flex flex-col rounded-3xl bg-orange-300">
        <h1 class="max-w-sm mx-auto py-6 text-white font-default-font text-4xl">Login</h1>
        <form @submit.prevent="login" class="max-w-sm mx-auto max-h-md">
            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-white">Email</label>
                <input type="text" placeholder="Email" v-model="email" id="email" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"/>
            </div>
            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-white">Password</label>
                <input type="password" placeholder="Password" v-model="password" id="password" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"/>
            </div>
            <div class="grid justify-items-center pt-3">
                <button type="submit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Login</button>
            </div>
            <p class="max-w-sm mx-auto pt-5 text-white">Need an account? <router-link to="/register">Register Here</router-link></p>
            <p class="max-w-sm mx-auto pt-1 pb-5 text-white">Need a Leasing Company account? <router-link to="/company-register">Register Here</router-link></p>
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
                            contactinfo: userDoc.data().contactinfo,
                            preferences: userDoc.data().preferences,
                            habits: userDoc.data().habits,
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
.center-top {
    margin-top: 8%;
}
</style>