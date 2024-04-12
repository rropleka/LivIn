<script>
import { getFirestore, collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore/lite'
import { getAuth } from 'firebase/auth'
import { firebaseapp } from '../main'
import { ref} from 'vue'
import router from '../router/index'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import axios from 'axios'

export default {
    props: {
        username: {
            type: String,
            required: true
        }
    },
    async setup(props) {
        /* Setup for searched user details */
        const user = ref(null)
        const username1 = props.username
        const db = getFirestore(firebaseapp)
        const userdb = collection(db, "users")
        const q = query(userdb, where("username", "==", username1))
        const qSnapshot = await getDocs(q)
        qSnapshot.forEach((doc) => {
            user.value = doc.data()
        })
        const uid = qSnapshot.docs[0].id
    
        /* Setup for logged user query */
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const currentUserID = currentUser.uid;
        let currentUserIsMod = false; // Initialize moderator flag

        try {
            const userDocRef = doc(db, 'users', currentUserID);
            const userDocSnap = await getDoc(userDocRef);

            /* Set moderator flag to allow delete button to appear */
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                console.log(userData);
                if (userData.userType) {
                    if (userData.userType == "sitemoderator") {
                        currentUserIsMod = true;
                    }
                }
            } else {
                console.error('User data does not exist.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }


        return {
            user,
            currentUser,
            currentUserIsMod,
            userdb,
            uid
        }
    },
    components: {
        ConfirmationDialog
    },
    data() {
        return {
            confirmVisible: false,
            confirmationMessage: "Are you sure you want to delete this user's account? This action cannot be undone and all data will be lost. Be sure you are doing this for a valid reason."
        };
    },
    methods: {
        showConfirmation() {
            this.confirmVisible = true;
        },
        hideConfirmation() {
            this.confirmVisible = false;
        },
        async deleteAccount() {

            if (this.user) {
                const db = getFirestore();
                const userDocRef = doc(db, "users", this.uid);

                try {
                    // Delete user data from Firestore
                    await deleteDoc(userDocRef);

                    /* CURRENTLY DOES NOT DELETE USER FROM AUTH */
                    // Delete user account from Firebase Authentication
                    // await this.deleteUserByUID(this.uid);
                    /* CURRENTLY DOES NOT DELETE USER FROM AUTH */

                    // Redirect to the search users page or any other desired destination
                    router.push('/search-users');
                } catch (error) {
                    console.error("Error deleting user account:", error.message);
                    // Handle error appropriately, e.g., show error message to the user
                    alert("An error occurred while deleting your account. Please try again later.");
                }
            } else {
                // User is not signed in, handle this case accordingly
                console.error("No user found to delete.");
                alert("User not found.");
            }
        },
        async deleteUserByUID(uid) {
            try {
                // Make an HTTP request to the Cloud Function endpoint
                const response = await axios.post('https://us-central1-livin-cs407.cloudfunctions.net/deleteUserByUID', { uid });
                console.log(response.data); // Handle response from Cloud Function

                // Redirect to the search users page or any other desired destination
                router.push('/search-users');
            } catch (error) {
                console.error('Error calling Cloud Function:', error);
            }
        }
    }
}
</script>

<template>
    <div class="grid grid-cols-4 py-6">
        <div class="h-0"></div>
        <form class="container col-span-2 mx-auto overscroll-auto" @submit.prevent>
            <h1 class="text-3xl font-default-font text-gray-900 mb-6">{{ user.username }}'s page</h1>
            <hr class="border-2 mb-4 border-orange-200 rounded-sm">
            <div class="mb-6">
                <!--img v-if="isPurdueEmail" src="@/assets/purdue-logo.png" alt="Purdue Icon" class="icon" once implemented-->
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input v-model="user.username" type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5" readonly>
            </div> 
            <div class="mb-6">
                <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                <input v-model="user.age" type="number" id="age" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly> 
            </div> 
            <div class="mb-6">
                <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                <input v-model="user.gender" type="text" id="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
            </div>  
            <div class="mb-6">
                <label for="class" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Class</label>
                <input v-model="user.class" type="number" id="class" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
            </div> 
            <div class="mb-6">
                <label for="aboutme" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">About me</label>
                <textarea v-model="user.aboutme" type="text" id="aboutme" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly></textarea>
        
            </div>
            <div class="mb-6">
                <label for="contactinfo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact info</label>
                <textarea v-model="user.contactinfo" type="text" id="contactinfo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 " readonly></textarea>
            </div>

            <hr class="border-2 mb-4 border-orange-200 rounded-sm">
            <div v-if="user.habits !== undefined">
                <div class="mb-6">
                    <label for="smoker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Does {{ user.username }} smoke?</label>
                    <input v-model="user.habits[0]" type="text" id="smoker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
                <div class="mb-6">
                    <label for="earlysleep" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Does {{ user.username }} sleep late?</label>
                    <input v-model="user.habits[1]" type="text" id="earlysleep" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
                <div class="mb-6">
                    <label for="roomstudy" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Does {{ user.username }} prefer studying in their room?</label>
                    <input v-model="user.habits[2]" type="text" id="roomstudy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
                <div class="mb-6">
                    <label for="party" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Does {{ user.username }} want to host parties?</label>
                    <input v-model="user.habits[3]" type="text" id="party" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
                <div class="mb-6">
                    <label for="diet" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Which diet does {{ user.username }} follow?</label>
                    <input v-model="user.habits[4]" type="text" id="diet" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
                <div class="mb-6">
                    <label for="drinker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Does {{ user.username }} drink?</label>
                    <input v-model="user.habits[5]" type="text" id="drinker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
                <div class="mb-6">
                    <label for="partner" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Does {{ user.username }} want to bring over their partner?</label>
                    <input v-model="user.habits[6]" type="text" id="partner" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
                <div class="mb-6">
                    <label for="noise" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Does {{ user.username }} consider themselves noisy?</label>
                    <input v-model="user.habits[7]" type="text" id="noise" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 " readonly>
                </div>
            </div>
            <button v-if="currentUserIsMod" style="color: red;" @click="showConfirmation">Delete Account</button>
            <confirmation-dialog v-if="confirmVisible" :message="confirmationMessage" @cancel="hideConfirmation" @confirm="deleteAccount" />

        </form>
    </div>
    
</template>