<script>
import { ref } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'

export default {
    async setup() {
        const search = ref('')
        const db = getFirestore(firebaseapp)
        const users = ref([])
        let userdb = []

        try {
            userdb = collection(db, "users")
        } catch (error) {
            console.error('Error fetching properties:', error.message)
        }
        
        users.value = []
        const q = query(userdb, where("accountPrivacy", "==", "public"))
        const qSnapshot = await getDocs(q)
        qSnapshot.forEach((doc) => {
            if (doc.data().userType != "sitemoderator")
            {
                users.value.push({
                    username: doc.data().username,
                    name: doc.data().name,
                    class: doc.data().class,
                    age: doc.data().age,
                    gender: doc.data().gender,
                })
            }
        })

        async function filterUsers() {
            
        }

        return {
            search,
            users,
            filterUsers
        }
    }
}
</script>

<template>
    <div class="grid grid-cols-3 justify-center">
        <div></div>
        <form class="py-4" @submit.prevent="filterUsers()">
            <button type="submit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">Apply</button>
        </form>
    </div>

    <div class="grid grid-cols-4 p-6 result-cont-height">
        <div class="h-0"></div>
        <div class="col-span-2 result-cont-height">
            <p class="text-lg font-medium text-gray-900 mb-2">Suggested roommates</p>
            <div class="overflow-hidden overflow-y-auto border-2 p-4 border-dark-orange rounded-lg max-result-height">
                <div v-for="user in users" :key="user.username" class="flex flex-row justify-between px-4 py-2 my-2 border-2 border-orange-200 shadow-md rounded-md">
                    <div class="flex flex-col">
                        <p class="text-lg font-medium text-gray-900">{{ user.name }}</p>
                        <p class="text-lg font-medium text-gray-900">Age: {{ user.age }} </p>
                        <p class="text-lg font-medium text-gray-900">Class: {{ user.class }}</p>
                        <p class="text-lg font-medium text-gray-900">Gender: {{ user.gender }}</p>
                    </div>
                    <button class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2">
                        <router-link :to="{ name: 'user-page', params: { username: user.username } }">
                            View
                        </router-link>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.max-result-height {
    max-height: 105%;
}
.result-cont-height {
    height: 70%;
}
</style>