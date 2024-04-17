<script>
import draggable from "vuedraggable"
import { ref, computed } from "vue"
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite'
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
        const users = ref([])
        let userdb = []

		try {
			userdb = collection(db, "fav-users")
		} catch (error) {
			console.error('Error fetching properties:', error.message)
		}

		const q = query(userdb, where("owner", "==", currUser.value.username))
        const qSnapshot = await getDocs(q)
		qSnapshot.forEach((doc) => {
			users.value.push({
				username: doc.data().username,
				name: doc.data().name,
				class: doc.data().class,
				age: doc.data().age,
				gender: doc.data().gender
			})
		})

		const drag = ref(false)

		let templist = []

		function changeEdit() {
			templist = []
			users.value.forEach((element) => {
				templist.push(element)
			})
			drag.value = !(drag.value)
			console.log(list.value)
		}

		function cancelEdit() {
			users.value = []
			templist.forEach((element) => {
				list.value.push(element)
			})
			drag.value = !(drag.value)
			console.log(list.value)
		}

		function saveEdit() {
			drag.value = !(drag.value)
		}

		return {
			users,
			drag,
			changeEdit,
			cancelEdit,
			saveEdit
		}
	}
}

</script>

<template>
	<p class="font-default-font text-2xl font-medium text-center">Favorite users</p>
	<div class="grid grid-cols-5 p-6">
		<div></div>
		<draggable 
			v-model="users" 
			:disabled="!drag"
			:key="users"
			item-key="username"	
			class="col-span-3">
			<template #item="{element}">
				<div class=" flex flex-row justify-between px-4 py-2 my-2 border-2 border-orange-200 shadow-md rounded-md">
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
						<button class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2">
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
	</div>
</template>