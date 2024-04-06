<template>
    <div style="background-color: white;">
        <form @submit.prevent="saveChanges" class="container mx-auto overscroll-auto">
            <div class="mb-6">
                <label for="smoker" class="block mb-2 text-sm font-medium text-gray-900">Do you smoke?</label>
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

        if (user.value.preferences === undefined) {
            user.value.preferences = ['']
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
                this.user.preferences = ['']
            }
            else
            {
                this.user.preferences = user.preferences;
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
                preferences: this.user.preferences
            });
        },
    },
}
</script>