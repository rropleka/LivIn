<script>
import draggable from "vuedraggable"
import { ref, computed } from "vue"
import { getFirestore, collection, doc, getDoc, updateDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import { useStore } from 'vuex'

export default {
	components: {
		draggable,
	},
	async setup() {
		const store = useStore()
        const currUser = computed(() => store.getters.currentUser)

        const db = getFirestore(firebaseapp)
        let userdb = []

		try {
			userdb = collection(db, "users")
		} catch (error) {
			console.error('Error fetching properties:', error.message)
		}

		const userdocref = await doc(userdb, currUser.value.uid)
        const userdoc = await getDoc(userdocref)

        const favUsers = ref([])
		favUsers.value = userdoc.data().favUsers

		const drag = ref(false)

		let templist = []
		function changeEdit() {
			templist = []
			favUsers.value.forEach((element) => {
				templist.push(element)
			})
			drag.value = !(drag.value)
		}

		function cancelEdit() {
			favUsers.value = []
			templist.forEach((element) => {
				favUsers.value.push(element)
			})
			drag.value = !(drag.value)
		}

		function saveEdit() {
			updateDoc(userdocref, {
				favUsers: favUsers.value
			})
			drag.value = !(drag.value)
		}

		function removeUser(favUser) {
			const idx = favUsers.value.indexOf(favUser)
			favUsers.value.splice(idx, 1)
			updateDoc(userdocref, {
				favUsers: favUsers.value
			})
		}

		return {
			favUsers,
			drag,
			changeEdit,
			cancelEdit,
			saveEdit,
			removeUser
		}
	}
}

</script>

<template>
	<p class="font-default-font text-2xl font-medium text-center">Favorite users</p>
	<div class="grid grid-cols-5 p-6">
		<div></div>
		<draggable 
			v-if="favUsers && favUsers.length > 0"
			v-model="favUsers" 
			:disabled="!drag"
			:key="favUsers"
			item-key="username"	
			class="col-span-3">
			<template #item="{element}">
				<div class="flex flex-row justify-between px-4 py-2 my-2 border-2 border-orange-200 shadow-md rounded-md">
					<div class="flex flex-col">
						<p class="text-lg font-medium text-gray-900">{{ element.name }}</p>
						<p class="text-lg font-medium text-gray-900">Age: {{ element.age }} </p>
						<p class="text-lg font-medium text-gray-900">Class: {{ element.class }}</p>
						<p class="text-lg font-medium text-gray-900">Gender: {{ element.gender }}</p>
					</div>
					<div class="flex flex-col justify-center">
						<button class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2">
							<router-link :to="{ name: 'user-page', params: { username: element.username } }">
								View
							</router-link>
						</button>
						<button @click="removeUser(element)" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2">
							Remove
						</button>
					</div>
				</div>
			</template>
			<template #header>
				<button v-if="!drag" @click="changeEdit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">
					Edit
				</button>
				<button v-if="drag" @click="cancelEdit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">
					Cancel
				</button>
				<button v-if="drag" @click="saveEdit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">
					Save
				</button>
			</template>
		</draggable>
		<p v-else class="col-span-3 text-lg text-center font-medium text-gray-900">No favorite users</p>
	</div>
</template>