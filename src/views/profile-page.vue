<script setup>
import AccountInfo from '../components/account-info.vue'
</script>

<script>
import { ref } from 'vue'

const page = ref(1)

export default {
    components: {
        AccountInfo
    },
    setup() {
        return {
            page
        }
    },
    methods: {
        setPage(page) {
            this.page = page
            console.log('page', page)
        }
    }
}
</script>

<template>
    <div class="flex flex-nowrap">
        <aside id="default-sidebar" class="z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
            <div class="h-full px-3 py-4 overflow-y-auto bg-light-orange">
                <ul class="space-y-2 font-medium">
                    <li>
                        <button @click="setPage(1)" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-amber-200 group">
                            <svg class="w-5 h-5 fill-orange-300 group-hover:fill-orange-400" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Account info</span>
                        </button>
                    </li>
                    <li>
                        <button @click="setPage(2)"  class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-amber-200 group">
                            <svg class="w-5 h-5 fill-orange-300 group-hover:fill-orange-400" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Favorite locations</span>
                        </button>
                    </li>
                    <li>
                        <button @click="setPage(3)"  class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-amber-200 group">
                            <svg class="w-5 h-5 fill-orange-300 group-hover:fill-orange-400" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Saved Properties</span>
                        </button>
                    </li>
                    <li>
                        <button @click="setPage(4)"  class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-amber-200 group">
                            <svg class="w-5 h-5 fill-orange-300 group-hover:fill-orange-400" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Saved lists</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
        <div class="p-10 grow">
            <AccountInfo />
        </div>
    </div>
</template>