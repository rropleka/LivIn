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

        async function searchUsers(search) {
            users.value = []
            const q = query(userdb, where("username", ">=", search), where("username", "<=", search + "\uf8ff"))
            const qSnapshot = await getDocs(q)
            qSnapshot.forEach((doc) => {
                if (!doc.data().accountPrivacy || doc.data().accountPrivacy === "public") // for when implemented, works even if field is not present
                {
                    users.value.push({
                        username: doc.data().username,
                        name: doc.data().name
                    })
                }
            })
        }

        return {
            search,
            users,
            searchUsers
        }
    }
}
</script>

<template>
    <div class="grid grid-cols-3 justify-center">
        <div></div>
        <form class="py-4" @submit.prevent="searchUsers(search)">
            <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search users</label>
            <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input v-model="search" type="search" id="search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search users" required />
                <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">Search</button>
            </div>
        </form>
    </div>

    <div class="grid grid-cols-4 p-6 result-cont-height">
        <div class="h-0"></div>
        <div class="col-span-2 result-cont-height">
            <p class="text-lg font-medium text-gray-900 mb-2">Search results</p>
            <div class="overflow-hidden overflow-y-auto border-2 p-4 border-dark-orange rounded-lg max-result-height">
                <div v-for="user in users" :key="user.username" class="flex flex-row justify-between px-4 py-2 my-2 border-2 border-orange-200 shadow-md rounded-md">
                    <div class="flex flex-col">
                        <p class="text-lg font-medium text-gray-900">{{ user.name }}</p>
                        <p class="text-lg font-medium text-gray-900"> {{ user.username }} </p>
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