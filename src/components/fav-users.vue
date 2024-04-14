<script>
import draggable from "vuedraggable"
import { ref } from "vue"

export default {
  components: {
    draggable,
  },
  setup() {
    const list = ref([
      { id: 1, name: "John" },
      { id: 2, name: "Doe" },
      { id: 3, name: "Jane" },
      { id: 4, name: "Doe" }
    ])

    return {
      list,
    }
  },
  data() {
    return{
      drag: true
    }
  }
}

</script>

<template>
	<draggable 
		v-model="list" 
		:disabled="!drag"
		@change="console.log(list)"
		item-key="id">
		<template #item="{element}">
			<div>
				{{ element.name }}
			</div>
		</template>
	</draggable>
</template>