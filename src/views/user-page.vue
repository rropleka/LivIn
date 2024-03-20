<script>
import { ref } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'

export default {
    props: {
        username: {
            type: String,
            required: true
        }
    }, 
    async setup(props) {
        const user = ref(null)
        const db = getFirestore(firebaseapp)
        const userdb = collection(db, "users")
        const q = query(userdb, where("username", "==", props.username))
        const qSnapshot = await getDocs(q)
        qSnapshot.forEach((doc) => {
            user.value = doc.data()
        })

        return {
            user
        }
    }
}
</script>

<template>
    <div class="grid grid-cols-4 py-6">
        <div class="h-0"></div>
        <form class="container col-span-2 mx-auto overscroll-auto">
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
        </form>
    </div>
    
</template>