<template>
    <div style="background-color: white;">
        <form @submit.prevent="saveChanges" class="container mx-auto overscroll-auto">
            <div class="mb-6">
                <img v-if="isPurdueEmail" src="@/assets/purdue-logo.png" alt="Purdue Icon" class="icon">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
                <div v-if="isLoginEditable === true">
                    <input v-model="user.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div v-else>
                    <input v-model="user.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>
            </div>
            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <div v-if="isLoginEditable === true">
                    <input v-model="user.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div v-else>
                    <input v-model="user.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>
            </div> 
            <hr class="border-2 mb-4 border-orange-200 rounded-sm">
            <div class="mb-6">
                <label for="accountPrivacy" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Privacy</label>
                <select v-model="user.accountPrivacy" id="accountPrivacy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="public">Public</option>
                <option value="private">Private</option>
                </select>
            </div>
            <div class="mb-6">
                <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
                <button @click.prevent="saveAccountPrivacy" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Save Account Privacy</button>
            </div>
            <hr class="border-2 mb-4 border-orange-200 rounded-sm">
            <div class="mb-6">
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <div v-if="isInfoEditable === true">
                    <input v-model="user.username" type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                </div>
                <div v-else>
                    <input v-model="user.username" type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>
            </div> 
            <div class="mb-6">
                <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                <div v-if="isInfoEditable === true">
                    <input v-model="user.age" type="number" id="age" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                </div>
                <div v-else>
                    <input v-model="user.age" type="number" id="age" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>
            </div> 
            <div class="mb-6">
                <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                <div v-if="isInfoEditable === true">
                    <input v-model="user.gender" type="text" id="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                </div>
                <div v-else>
                    <input v-model="user.gender" type="text" id="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>
            </div>  
            <div class="mb-6">
                <label for="class" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Class</label>
                <div v-if="isInfoEditable === true">
                    <input v-model="user.class" type="number" id="class" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                </div>
                <div v-else>
                    <input v-model="user.class" type="number" id="class" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>
            </div> 
            <div class="mb-6">
                <label for="aboutme" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">About me</label>
                <div v-if="isInfoEditable === true">
                    <textarea v-model="user.aboutme" type="text" id="aboutme" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required></textarea>
                </div>
                <div v-else>
                    <textarea v-model="user.aboutme" type="text" id="aboutme" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly></textarea>
                </div>
            </div>
            <div class="mb-6">
                <label for="contactinfo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact info</label>
                <div v-if="isInfoEditable">
                    <textarea v-model="user.contactinfo" type="text" id="contactinfo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required></textarea>
                </div>
                <div v-else>
                    <textarea v-model="user.contactinfo" type="text" id="contactinfo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly></textarea>
                </div>
            </div>
            <button v-if="!isInfoEditable" @click.prevent="toggleLoginEditable" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ isLoginEditable ? 'Cancel' : 'Edit login' }}</button>
            <button type="submit" v-if="isLoginEditable" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Save Changes</button>
            <button v-if="!isLoginEditable" @click.prevent="toggleInfoEditable" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ isInfoEditable ? 'Cancel' : 'Edit info' }}</button>
            <button type="submit" v-if="isInfoEditable" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Save Changes</button>
            <button style="color: red;" @click="showConfirmation">Delete Account</button>
            <confirmation-dialog v-if="confirmVisible" :message="confirmationMessage" @cancel="hideConfirmation" @confirm="deleteAccount" />
            <button style="color: red;" @click="deregisterVisible=true">Deregister as Leasing Company</button>
            <confirmation-dialog v-if="deregisterVisible" :message="deregisterMessage" @cancel="deregisterVisible=false" @confirm="toggleDeregister" />

        </form>
        </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { getAuth, updatePassword, verifyBeforeUpdateEmail, deleteUser, reauthenticateWithCredential, EmailAuthCredential, EmailAuthProvider } from "firebase/auth"
import { getFirestore, collection, doc, getDoc, setDoc, deleteDoc, updateDoc, where, getDocs, query } from 'firebase/firestore/lite'
import { firebaseapp } from '../firebaseInit'
import router from '../router/index'
import store from '@/stores/auth/store'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

export default {
    setup() {
        const isLoginEditable = ref(false)
        const isInfoEditable = ref(false)
        const store = useStore();

        const user = computed(() => store.getters.currentUser);
        const origUser = store.getters.currUserCopy;
        return {
            isLoginEditable,
            isInfoEditable,
            origUser,
            user,
            errorMessage: '',
        }
    },
    components: {
        ConfirmationDialog
    },
    data() {         
        return {             
            confirmVisible: false,             
            deregisterVisible: false,
            confirmationMessage: "Are you sure you want to delete your account? This action cannot be undone.",
            deregisterMessage: "Are you sure you want to deregister as a leasing company? This action cannot be undone. (NOTE: For demo purposes only this action can be undone)"
        };     
    },
    methods: {
        async reauthenticateUser(user, prompt) {
            // Refresh auth token here 
            const password = prompt(prompt)
            const credential = EmailAuthProvider.credential(user.email, password)
            await reauthenticateWithCredential(user, credential)
        },
        toggleLoginEditable() {
            this.isLoginEditable = !this.isLoginEditable
        },
        toggleInfoEditable() {
            this.isInfoEditable = !this.isInfoEditable
            // crude way to reset the user's info if they cancel the changes
            this.user.username = this.origUser.username;
            this.user.age = this.origUser.age;
            this.user.gender = this.origUser.gender;
            this.user.class = this.origUser.class;
            this.user.aboutme = this.origUser.aboutme;
            this.user.contactinfo = this.origUser.contactinfo;
        },
        async toggleDeregister() {
            const db = getFirestore(firebaseapp);
            const userDocRef = doc(db, 'users', this.user.uid);
            const userDocSnapshot = await getDoc(userDocRef); // Use getDoc to get the document snapshot

            let usertype = ""
            if (userDocSnapshot.data().userType != "notLeasingCompany") {
                usertype = "notLeasingCompany"
            }
            else {
                usertype = "sitemoderator"
            }
            await updateDoc(userDocRef, {userType: usertype});
        },
        async saveAccountPrivacy() {
    // Save the user's account privacy to the database
    const db = getFirestore(firebaseapp);
    const userDocRef = doc(db, 'users', this.user.uid);

    // Check if the accountPrivacy field is already present in the document
    const userDocSnapshot = await getDoc(userDocRef); // Use getDoc to get the document snapshot

    // Check if the user is a sublease user with a private account
    if (this.user.accountPrivacy === 'private') {
      const subleasesCollectionRef = collection(db, 'subleases');
      const subleaseQuerySnapshot = await getDocs(
        query(subleasesCollectionRef, where('leaseOwner', '==', this.user.username))
      );

      if (!subleaseQuerySnapshot.empty) {
        // Sublease user with private account found
        const confirmPrompt = confirm("You are subletting and users would not be able to search you.");
        if (!confirmPrompt) {
            return;
        }
      } else {
        this.errorMessage = '';
      }
    }

    if (userDocSnapshot.exists()) {
        // Update the document with accountPrivacy field
        await updateDoc(userDocRef, { accountPrivacy: this.user.accountPrivacy });
    } else {
        // Add the document with accountPrivacy field
        await setDoc(userDocRef, { accountPrivacy: this.user.accountPrivacy });
    }
    alert("Account privacy saved successfully!");
},
        /* Function to update email and password on firebase upon modification */
        async saveLoginChanges() {
            const auth = getAuth();
            const currUser = auth.currentUser;
            
            try {
                /* If user enters a new email, send verification link and send them to login to relogin */
                if (this.user.email !== this.origUser.email) {
                    verifyBeforeUpdateEmail(currUser, this.user.email)
                    alert(`A verification email has been sent to ${this.user.email}. Please verify then sign in with your new credentials.`);
                    router.push('/login')
                }

                if (this.user.password) {
                    // Refresh auth token here 
                    // const password = prompt("Please enter your current password to complete the password change.")
                    // const credential = EmailAuthProvider.credential(currUser.email, password)
                    // await reauthenticateWithCredential(this.user, credential)
                    await updatePassword(currUser, this.user.password);
                    alert("Your account password has been updated please login again with your new credentials.")
                    router.push('/login')
                }
            } catch (error) {
                alert(error.message);
            }
        },
        async saveInfoChanges() {
            // Save the user's info to the database
            this.isInfoEditable = !this.isInfoEditable;
            store.dispatch('loginUser', this.user);
            const db = getFirestore(firebaseapp)
            const userDocRef = doc(collection(db, 'users'), this.user.uid);
            await updateDoc(userDocRef, {
                username: this.user.username,
                age: this.user.age,
                gender: this.user.gender,
                class: this.user.class,
                aboutme: this.user.aboutme,
                contactinfo: this.user.contactinfo,
            });
        },
        async saveChanges() {
            if (this.isLoginEditable) {
                this.saveLoginChanges();
            } else if (this.isInfoEditable) {
                this.saveInfoChanges();
            }
        },
        showConfirmation() {
            this.confirmVisible = true;
        },
        hideConfirmation() {
            this.confirmVisible = false;
        },
        async deleteAccount() {
            const auth = getAuth();
            const user = auth.currentUser;
            console.log(user);

            if (user) {
                const db = getFirestore();
                const userDocRef = doc(db, "users", user.uid);

                
                try {
                    // Reauth user before deleteUser is called
                    // this.reauthenticateUser(user, "Please enter your password to delete your account.")
                    const password = prompt("Enter your password to delete your account.")
                    const credential = EmailAuthProvider.credential(user.email, password)
                    await reauthenticateWithCredential(user, credential)


                    // Delete user data from Firestore
                    await deleteDoc(userDocRef);

                    // Delete user account from Firebase Authentication
                    await deleteUser(user);

                    // Redirect to the login page or any other desired destination
                    store.dispatch('logoutUser')
                    router.push('/login');
                } catch (error) {
                    console.error("Error deleting user account:", error.message);
                    // Handle error appropriately, e.g., show error message to the user
                    alert("Error re-authenticating user, please check your password and try again.");
                }
            } else {
                // User is not signed in, handle this case accordingly
                console.error("No user signed in to delete.");
                alert("You are not signed in.");
            }
        }
    },
    computed: {
        // Check if the user's email ends with '@purdue.edu'
        isPurdueEmail() {
            return this.user.email.endsWith('@purdue.edu');
        }
    }
}
</script>

<style>
.icon {
    width: 50px;
    height: 50px;
}

.error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 20px;
}

</style>