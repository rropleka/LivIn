<script>
import { ref } from 'vue'
import { initDropdowns } from 'flowbite'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'

export default {
  async setup() {
    const db = getFirestore(firebaseapp)
    const properties = ref([])

    try {
      properties.value = collection(db, "properties")
      console.log(properties.value)
    } catch (error) {
      console.error('Error fetching properties:', error.message)
    }

    const propList1 = ref([])
    const propList2 = ref([])

    const emptyProp = {
      name: "",
      address: "",
      owner: "",
      reviews: 0,
      details: ""
    }
    

    const property1 = ref(emptyProp)
    const property2 = ref(emptyProp)

    const search1 = ref('')
    const search2 = ref('')

    function setProperty1(property) {
      property1.value = property
    }
    function setProperty2(property) {
      property2.value = property
    }

    async function setPropList1(search) {
      const q = query(properties.value, where("propertyName", ">=", search), where("propertyName", "<=", search + "\uf8ff"))
      const qSnapshot = await getDocs(q)
      propList1.value = []
      qSnapshot.forEach((doc) => {
        let property = doc.data()
        propList1.value.push({
          name: property.propertyName,
          address: property.location,
          owner: property.owner,
          reviews: property.rating,
          details: getDetails(property)
        })
      })
    }

    async function setPropList2(search) {
      const q = query(properties.value, where("propertyName", ">=", search), where("propertyName", "<=", search + "\uf8ff"))
      const qSnapshot = await getDocs(q)
      propList2.value = []
      qSnapshot.forEach((doc) => {
        let property = doc.data()
        propList2.value.push({
          name: property.propertyName,
          address: property.location,
          owner: property.owner,
          reviews: property.rating,
          details: getDetails(property)
        })
      })
    }

    function getDetails(property) {
      let details = ""
      details += property.description + "\n"
      details += "Amenities: \n"
      for (let i = 0; i < property.amenities.length; i++) {
        details += property.amenities[i] + "\n"
      }
      return details
    }

    return {
      emptyProp,
      property1,
      property2,
      search1,
      search2,
      propList1,
      propList2,
      setProperty1,
      setProperty2,
      setPropList1,
      setPropList2
    }
  },
  mounted() {
    initDropdowns()
  }
}
</script>

<template>
    <div class="py-10 columns-2">

      <!-- First half -->
      <div class="flex flex-col p-4">
        <!-- Button -->
        <button id="dropdownProps1Button" data-dropdown-toggle="dropdownProperties1" data-dropdown-placement="bottom" class="text-white bg-orange-300 hover:bg-orange-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center grow" type="button">
          Search properties 
          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div id="dropdownProperties1" class="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
          <div class="p-3">
            <label for="input-group-search" class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input v-model="search1" @keyup.enter="setPropList1(search1)" type="text" id="input-group-search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search properties">
            </div>
          </div>
          <ul class="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
            <li v-for="property in propList1" :key="property.name" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" @click="setProperty1(property)">{{ property.name }}</li>
          </ul>
        </div>
        <div class="my-2">
          <div class="mb-6">
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property name</label>
            <input v-model="property1.name" type="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div> 
          <div class="mb-6">
            <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property address</label>
            <input v-model="property1.address" type="address" id="address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div>
          <div class="mb-6">
            <label for="owner" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property owner</label>
            <input v-model="property1.address" type="owner" id="owner" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div>
          <div class="mb-6">
            <label for="review" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property reviews</label>
            <input v-model="property1.reviews" type="review" id="review" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div>
          <div class="mb-6">
            <label for="details" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property reviews</label>
            <textarea v-model="property1.details" type="details" id="details" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly></textarea>
          </div>
        </div>
        <button @click.prevent="setProperty1(emptyProp)" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Clear</button>
        <button>
          <router-link :to="{ name: 'property-page', params: { leasingCompany: property1.owner, PropertyName: property1.name } }" class=" ml-4 py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">
            Go to property
          </router-link>
        </button>
      </div>

      <!-- Second half -->
      <div class="flex flex-col p-4">
        <!-- Button -->
        <button id="dropdownProps2Button" data-dropdown-toggle="dropdownProperties2" data-dropdown-placement="bottom" class="text-white bg-orange-300 hover:bg-orange-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center " type="button">
          Search properties 
          <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div id="dropdownProperties2" class="z-10 hidden bg-white rounded-lg shadow">
          <div class="p-3">
            <label for="input-group-search" class="sr-only">Search</label>
            <div class="relative">
              <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input v-model="search2" @keyup.enter="setPropList2(search1)" type="text" id="input-group-search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" placeholder="Search properties">
            </div>
          </div>
          <ul class="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
            <li v-for="property in propList2" :key="property.name" class="px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" @click="setProperty2(property)">{{ property.name }}</li>
          </ul>
        </div>
        <div class="my-2">
          <div class="mb-6">
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property name</label>
            <input v-model="property2.name" type="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div> 
          <div class="mb-6">
            <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property address</label>
            <input v-model="property2.address" type="address" id="address" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div>
          <div class="mb-6">
            <label for="owner" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property owner</label>
            <input v-model="property2.address" type="owner" id="owner" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div>
          <div class="mb-6">
            <label for="review" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property reviews</label>
            <input v-model="property2.reviews" type="review" id="review" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly>
          </div>
          <div class="mb-6">
            <label for="details" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Property reviews</label>
            <textarea v-model="property2.details" type="details" id="details" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5" readonly></textarea>
          </div>
        </div>
        <button @click.prevent="setProperty2(emptyProp)" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Clear</button>
        <button>
          <router-link :to="{ name: 'property-page', params: { leasingCompany: property2.owner, PropertyName: property2.name } }" class=" ml-4 py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">
            Go to property
          </router-link>
        </button>
        
      </div>
      
    </div>
</template>