<script>
import { ref, computed } from 'vue'
import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import { useStore } from 'vuex'

export default {
    async setup() {
        const store = useStore()
        const user = computed(() => store.getters.currentUser)
        
        const hasReqs = ref(
            computed(() => user.value.preferences !== undefined && user.value.habits !== undefined)
        )

        const search = ref('')
        const db = getFirestore(firebaseapp)
        const users = ref([])
        let userdb = []

        const added = ref(false)
        const alradded = ref(false)

        try {
            userdb = collection(db, "users")
        } catch (error) {
            console.error('Error fetching properties:', error.message)
        }
        
        users.value = []
        if (hasReqs.value) {
            const q = query(userdb, where("accountPrivacy", "==", "public"))
            const qSnapshot = await getDocs(q)
            qSnapshot.forEach((doc) => {
                if (doc.data().userType != "sitemoderator" && doc.data().username != user.value.username)
                {
                    users.value.push({
                        username: doc.data().username,
                        name: doc.data().name,
                        class: doc.data().class,
                        age: doc.data().age,
                        gender: doc.data().gender,
                        habits: doc.data().habits,
                        preferences: doc.data().preferences
                    })
                }
            })
            users.value.sort(comparePref)
        }

        function comparePref(user1, user2) {
            let score1 = 0
            let score2 = 0

            if (user1.habits !== undefined && user1.preferences !== undefined) {
                score1 = getScore(user1)
            } else {
                score1 = -1
            }

            if (user2.habits !== undefined && user2.preferences !== undefined) {
                score2 = getScore(user2)
            } else {
                score2 = -1
            }
            
            return score2 - score1
        }

        function getScore(user1) {
            let score = 0
            if (user.value.preferences[0] === 'No' && user1.habits[0] === 'No') { //smoking
                score += 1
            }

            if (user.value.preferences[1] === 'No' && user1.habits[1] === 'No') { //late sleep
                score += 1
            }

            if (user.value.preferences[2] === 'No' && user1.habits[2] === 'No') { //study habits
                score += 1
            }

            if (user.value.preferences[3] === 'No' && user1.habits[3] === 'No') { //party
                score += 1
            }

            if (user.value.habits[4] !== 'None' && user1.preferences[4] === 'Yes') { //following a diet
                score += 10 //higher weight
            }

            if (user.value.preferences[5] === 'No' && user1.habits[5] === 'No') { //drinking
                score += 1
            }

            if (user.value.preferences[6] === 'No' && user1.habits[6] === 'No') { //S.O. over
                score += 1
            }

            if (user.value.preferences[7] === 'No' && user1.habits[7] === 'No') { //noisiness
                score += 1
            }
            
            return score
        }

        async function filterUsers() {
            
        }

        async function addFavorite(newFavUser) {
            const usercoll = collection(db, "users")
            const userdocref = await doc(usercoll, user.value.uid)
            const userdoc = await getDoc(userdocref)

            let favList = userdoc.data().favUsers
            if (favList === undefined) {
                favList = []
            }
            
            for (let i = 0; i < favList.length; i++) {
                if (favList[i].username === newFavUser.username) {
                    alradded.value = true
                    setTimeout(() => {
                        alradded.value = false
                    }, 800)
                    return
                }
            }

            favList.push({
                username: newFavUser.username,
                name: newFavUser.name,
                class: newFavUser.class,
                age: newFavUser.age,
                gender: newFavUser.gender
            })
            await updateDoc(userdocref, {
                favUsers: favList
            })
            
            added.value = true
            setTimeout(() => {
                added.value = false
            }, 800)
        }

        return {
            search,
            users,
            filterUsers,
            addFavorite,
            added,
            alradded,
            hasReqs
        }
    }
}
</script>

<template>
    <div v-if="hasReqs" class="grid grid-cols-3 justify-center">
        <div></div>
        <form class="py-4" @submit.prevent="filterUsers()">
            <button type="submit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">Apply</button>
        </form>
    </div>

    <div v-if="hasReqs" class="grid grid-cols-4 p-6 result-cont-height">
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
                    <div class="flex flex-col justify-center">
                        <button class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2">
                            <router-link :to="{ name: 'user-page', params: { username: user.username } }">
                                View
                            </router-link>
                        </button>
                        <button @click="addFavorite(user)" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2">
                            Favorite
                        </button>
                    </div>
                </div>
            </div>
            <span v-if="added" class="text-lg font-medium text-gray-900 m-2">User added to favorites!</span>
            <span v-if="alradded" class="text-lg font-medium text-gray-900 m-2">User already in favorites!</span>
        </div>
    </div>
    <div v-else class="grid grid-cols-4 p-6">
        <div></div>
        <p class="col-span-2 text-lg text-center font-medium text-gray-900">Please fill out your roommate preferences and habits in the preferences tab</p>
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