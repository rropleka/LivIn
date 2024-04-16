<script>
import draggable from "vuedraggable"
import { ref } from "vue"

export default {
	components: {
		draggable,
	},
	setup() {
		const list = ref([
		{ id: 1, name: "John", age: 20, class: 3, gender: 'male', username: 'john_doe'},
		{ id: 2, name: "Doe", age: 21, class: 2, gender: 'male', username: 'jdoe'},
		{ id: 3, name: "Jane", age: 22, class: 1, gender: 'female', username: 'jane_doe'},
		{ id: 4, name: "Doe", age: 23, class: 4, gender: 'female', username: 'doe2'}
		])

		const drag = ref(false)

		function changeEdit() {
			drag.value = !(drag.value)
			console.log(drag.value)
		}

		return {
			list,
			drag,
			changeEdit
		}
	}
}

</script>

<template>
	<p class="font-default-font text-2xl font-medium text-center">Favorite users</p>
	<div class="grid grid-cols-5 p-6">
		<div></div>
		<draggable 
			v-model="list" 
			:disabled="!drag"
			item-key="id"
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
				<button @click="changeEdit" class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-4 py-2">
					Edit
				</button>
			</template>
		</draggable>
	</div>
</template>