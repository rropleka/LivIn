<template>
    <div style="background-color: white;">
        <form @submit.prevent="saveChanges" class="container mx-auto overscroll-auto">
            <div class="mb-6">
                <label for="smoker" class="block mb-2 text-sm font-medium text-gray-900">Do you smoke?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[0]" id="smoker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[0]" id="smoker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="earlysleep" class="block mb-2 text-sm font-medium text-gray-900">Do you consider yourself a late sleeper?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[1]" id="earlysleep" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[1]" id="earlysleep" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="roomstudy" class="block mb-2 text-sm font-medium text-gray-900">Do you study primarily in your room/living space?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[2]" id="roomstudy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[2]" id="roomstudy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="party" class="block mb-2 text-sm font-medium text-gray-900">Do you plan on hosting parties?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[3]" id="party" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[3]" id="party" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="diet" class="block mb-2 text-sm font-medium text-gray-900">Do you follow a specific diet?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[4]" id="diet" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>None</option>
                        <option>Vegan</option>
                        <option>Vegetarian</option>
                        <option>Halal</option>
                        <option>Kosher</option>
                        <option>Yes, but not listed</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[4]" id="diet" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>None</option>
                        <option>Vegan</option>
                        <option>Vegetarian</option>
                        <option>Halal</option>
                        <option>Kosher</option>
                        <option>Yes, but not listed</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="drinker" class="block mb-2 text-sm font-medium text-gray-900">Do you drink alcohol?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[5]" id="drinker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[5]" id="drinker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="partner" class="block mb-2 text-sm font-medium text-gray-900">Do you plan on having a significant other over frequently?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[6]" id="partner" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[6]" id="partner" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="noise" class="block mb-2 text-sm font-medium text-gray-900">Do you consider yourself to be occasionaly noisy?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.habits[7]" id="noise" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.habits[7]" id="noise" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>

            <hr class="border-2 mb-4 border-orange-200 rounded-sm">
            <div class="mb-6">
                <label for="smoker" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to live with a smoker?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[0]" id="smoker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[0]" id="smoker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="earlysleep" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to live with a late sleeper?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[1]" id="earlysleep" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[1]" id="earlysleep" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="roomstudy" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to share living space with someone who studies at home?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[2]" id="roomstudy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[2]" id="roomstudy" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="party" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to live with someone who hosts parties?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[3]" id="party" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[3]" id="party" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="diet" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to be considerate of someone's diet?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[4]" id="diet" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[4]" id="diet" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="drinker" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to live with someone who drinks?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[5]" id="drinker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[5]" id="drinker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="partner" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to live with someone who invites their significant other frequently?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[6]" id="partner" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[6]" id="partner" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <div class="mb-6">
                <label for="noise" class="block mb-2 text-sm font-medium text-gray-900">Are you willing to live with someone who is occasionally noisy?</label>
                <div v-if="isInfoEditable === true">
                    <select v-model="user.preferences[7]" id="noise" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
                <div v-else>
                    <select v-model="user.preferences[7]" id="noise" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" disabled>
                        <option disabled value="">Please select an option</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                </div>
            </div>
            <hr class="border-2 mb-4 border-orange-200 rounded-sm">    
            <button v-if="!isInfoEditable" @click.prevent="toggleInfoEditable" class="block mb-2 text-sm font-medium text-gray-900"> Edit info</button>
            <button v-if="isInfoEditable" @click.prevent="cancelInfoEditable" class="block mb-2 text-sm font-medium text-gray-900">Cancel</button>
            <button type="submit" v-if="isInfoEditable" class="block mb-2 text-sm font-medium text-gray-900">Save Changes</button>

        </form>
        </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import { getFirestore, collection, doc, getDoc, setDoc, deleteDoc, updateDoc, where, getDocs, query } from 'firebase/firestore/lite'
import { firebaseapp } from '../firebaseInit'
import store from '@/stores/auth/store'

export default {
    setup() {
        const isInfoEditable = ref(false)
        const store = useStore();

        const user = computed(() => store.getters.currentUser);
        // very crude lol
        const origUser = JSON.stringify(store.getters.currUserCopy);

        if (user.value.habits === undefined) {
            user.value.habits = ['', '', '', '', '', '', '', '']
        }
        if (user.value.preferences === undefined) {
            user.value.preferences = ['', '', '', '', '', '', '', '']
        }
        return {
            isInfoEditable,
            origUser,
            user,
            errorMessage: '',
        }
    },
    methods: {
        toggleInfoEditable() {
            this.isInfoEditable = !this.isInfoEditable
        },
        cancelInfoEditable() {
            this.isInfoEditable = !this.isInfoEditable
            // crude way to reset the user's info if they cancel the changes
            const user = JSON.parse(this.origUser);
            if (user.preferences === undefined)
            {
                this.user.preferences = ['', '', '', '', '', '', '', '']
            }
            else
            {
                this.user.preferences = user.preferences;
            }

            if (user.habits === undefined)
            {
                this.user.habits = ['', '', '', '', '', '', '', '']
            }
            else
            {
                this.user.habits = user.habits;
            }
        },
        async saveChanges() {
            // Save the user's info to the database
            this.isInfoEditable = !this.isInfoEditable;
            store.dispatch('loginUser', this.user);
            const db = getFirestore(firebaseapp)
            const userDocRef = doc(collection(db, 'users'), this.user.uid);
            await setDoc(userDocRef, {
                username: this.user.username,
                age: this.user.age,
                gender: this.user.gender,
                class: this.user.class,
                aboutme: this.user.aboutme,
                contactinfo: this.user.contactinfo,
                preferences: this.user.preferences,
                habits: this.user.habits
            });
        },
    },
}
</script>