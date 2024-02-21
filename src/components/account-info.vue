<template>
        <form class="container mx-auto overscroll-auto">
            <div class="mb-6">
                <img v-if="isPurdueEmail" src="@/assets/purdue-logo.png" alt="Purdue Icon" class="icon">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
                <div v-if="isEditable === true">
                    <input v-model="user.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div v-else>
                    <input v-model="user.email" type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>
            </div>
            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <div v-if="isEditable === true">
                    <input v-model="user.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div v-else>
                    <input v-model="user.password" type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
                </div>

            </div> 
            <div class="mb-6">
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input v-model="user.username" type="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
            </div> 
            <div class="mb-6">
                <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                <input v-model="user.age" type="age" id="age" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
            </div> 
            <div class="mb-6">
                <label for="gender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                <input v-model="user.gender" type="gender" id="gender" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
            </div>  
            <div class="mb-6">
                <label for="class" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Class</label>
                <input v-model="user.class" type="class" id="class" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
            </div> 
            <div class="mb-6">
                <label for="aboutme" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">About me</label>
                <textarea v-model="user.aboutme" type="aboutme" id="aboutme" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly></textarea>
            </div>
            <div class="mb-6">
                <label for="contactinfo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact info</label>
                <input v-model="user.contactinfo" type="contactinfo" id="contactinfo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" readonly>
            </div>
            <button @click.prevent="toggleEditable" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ isEditable ? 'Cancel' : 'Edit login' }}</button>
            <button v-if="isEditable" @click.prevent="saveChanges" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Save Changes</button>
        </form>
</template>

<script>
import { mapState } from 'vuex'
import { ref } from 'vue'
import { getAuth, updateEmail, updatePassword, sendEmailVerification, verifyBeforeUpdateEmail } from "firebase/auth"
import router from '../router/index'

const isEditable = ref(false)
const originalEmail = getAuth().currentUser.email;

export default {
    data() {
        return {
            isEditable: isEditable
        }
    },
    methods: {
        toggleEditable() {
            this.isEditable = !this.isEditable
        },
        /* Function to update email and password on firebase upon modification */
        async saveChanges() {
            const auth = getAuth();
            const user = auth.currentUser;
            
            try {
                /* If user enters a new email, send verification link and send them to login to relogin */
                if (this.user.email !== originalEmail) {
                    verifyBeforeUpdateEmail(user, this.user.email)
                    alert(`A verification email has been sent to ${this.user.email}. Please verify then sign in with your new credentials.`);
                    router.push('/login')
                }

                if (this.user.password) {
                    await updatePassword(user, this.user.password);
                    alert("Your account password has been updated please login again with your new credentials.")
                    router.push('/login')
                }
            } catch (error) {
                    alert(error.message);
            }
        }
    },
    computed: {
        ...mapState({
            user: state => state.user
        }),
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
</style>