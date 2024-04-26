<script>
import { ref, computed } from 'vue'
import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import { useStore } from 'vuex'
import { initDropdowns } from 'flowbite'

export default {
    async setup() {
        const store = useStore()
        const user = computed(() => store.getters.currentUser)
        
        const hasReqs = ref(
            computed(() => user.value.preferences !== undefined && user.value.habits !== undefined)
        )

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

        const filteredUsers = ref([...users.value]) // make a copy instead of using values directly

        const genderFil = ref([false, false, false])
        const ageFrom = ref()
        const ageTo = ref()
        const classFrom = ref()
        const classTo = ref()
        function filterUsers() {
            filteredUsers.value = users.value.filter((el) => {
                let userGender = ''
                if (el.gender != undefined)
                {
                    userGender = el.gender.toLowerCase()
                }

                if ((genderFil.value[0] || genderFil.value[1] || genderFil.value[2]) && (userGender === 'male' && !genderFil.value[0] || userGender === 'female' && !genderFil.value[1] || (userGender !== 'female' && userGender !== 'male') && !genderFil.value[2])){
                    return
                }

                if (ageFrom.value && el.age < ageFrom.value)
                {
                    return
                }

                if (ageTo.value && el.age > ageTo.value)
                {
                    return
                }

                if (classFrom.value && el.class < classFrom.value)
                {
                    return
                }

                if (classTo.value && el.class > classTo.value)
                {
                    return
                }

                return el
            })
        }

        function clearFil() {
            genderFil.value = [false, false, false]
            ageFrom.value = undefined
            ageTo.value = undefined
            classFrom.value = undefined
            classTo.value = undefined
            filteredUsers.value = [...users.value]
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
            filteredUsers,
            addFavorite,
            added,
            alradded,
            hasReqs,
            filterUsers,
            genderFil,
            ageFrom,
            ageTo,
            classFrom,
            classTo,
            clearFil
        }
    },
    mounted() {
        initDropdowns()
    }
}
</script>

<template>
    <div v-if="hasReqs" class="grid grid-cols-5 justify-center">
        <div></div>
        <form class="py-4 col-span-3 justify-self-center" @submit.prevent="filterUsers()">
            <button id="genderDropButton" data-dropdown-toggle="genderDrop" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-orange-300 bg-white rounded-lg hover:bg-gray-200 border-2 border-orange-300" type="button">
                Gender 
                <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/></svg>
            </button>
            <!-- Gender dropdown menu -->
            <div id="genderDrop" class="z-10 hidden bg-white rounded-lg shadow w-60">
                <ul class="h-30 px-3 pb-3 overflow-y-auto text-sm text-gray-700" >
                    <li>
                        <div class="flex items-center p-2 mt-2 rounded hover:bg-gray-100">
                        <input v-model="genderFil[0]" id="checkbox-item-1" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  ">
                        <label for="checkbox-item-1" class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Male</label>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center p-2 rounded hover:bg-gray-100">
                        <input v-model="genderFil[1]" id="checkbox-item-2" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ">
                        <label for="checkbox-item-2" class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Female</label>
                        </div>
                    </li>
                    <li>
                        <div class="flex items-center p-2 rounded hover:bg-gray-100">
                        <input v-model="genderFil[2]" id="checkbox-item-3" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500">
                        <label for="checkbox-item-3" class="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">Other</label>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Age choose -->
            <div class="inline-flex">
                <div class=" ">
                    <input type="number" v-model="ageFrom" min=1 class="w-24 p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-r-0 border-2 border-orange-300 focus:border-2" placeholder="Min age" />
                </div>
                <div class="mr-2">
                    <input type="number" v-model="ageTo" min=1  class="w-24 p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-2 border-orange-300" placeholder="Max age" />
                </div>
            </div>
            
            <!-- Class choose -->
            <div class="inline-flex">
                <div class=" ">
                    <input type="number" v-model="classFrom" min=1 max=5 class="w-24 p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-r-0 border-2 border-orange-300 focus:border-2" placeholder="Min year" />
                </div>
                <div class="mr-2">
                    <input type="number" v-model="classTo" min=1 max=5  class="w-28 p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-2 border-orange-300" placeholder="Max year" />
                </div>
            </div>
            
            <button type="submit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">Apply</button>
            <button @click.prevent="clearFil()" class="text-dark-orange bg-white rounded-lg hover:bg-gray-200 border-2 border-dark-orange font-medium rounded-lg text-sm px-4 py-2">Clear</button>
        </form>
    </div>

    <div v-if="hasReqs" class="grid grid-cols-4 p-6">
        <div class="h-0"></div>
        <div class="col-span-2">
            <p class="text-lg font-medium text-gray-900 mb-2">Suggested roommates</p>
            <div class="overflow-hidden overflow-y-auto border-2 p-4 border-dark-orange rounded-lg max-result-height">
                <div v-for="user in filteredUsers" :key="user.username" class="flex flex-row justify-between px-4 py-2 my-2 border-2 border-orange-200 shadow-md rounded-md">
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
    max-height: calc(100vh - 300px);
}
</style>