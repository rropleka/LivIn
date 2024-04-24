
<script>
import { ref } from 'vue'
import AccountInfo from '../components/account-info.vue'
import Preferences from '../components/preference-page.vue'
import favUsers from '../components/fav-users.vue'

export default {
    components: {
        AccountInfo,
        Preferences,
        favUsers
    },
    setup() {
        const page = ref(1)

        function setPage(num) {
            page.value = num
        }

        return {
            page,
            setPage
        }
    }
}
</script>

<template>
    <div class="flex flex-nowrap">
        <aside id="default-sidebar" class="z-40 w-64 transition-transform -translate-x-full sm:translate-x-0">
            <div class="h-full px-3 py-4 sidebar-height overflow-y-auto bg-light-orange">
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
                            <span class="text-white text-lg ms-3">Roommate Form</span>
                        </button>
                    </li>
                    <li>
                        <button @click="setPage(3)"  class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-amber-200 group">
                            <svg class="w-5 h-5 fill-orange-300 group-hover:fill-orange-400" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Favorite Users</span>
                        </button>
                    </li>
                    <li>
                        <button @click="this.$router.push('/lists')"  class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-amber-200 group">
                            <svg class="w-5 h-5 fill-orange-300 group-hover:fill-orange-400" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Saved lists</span>
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
        <div v-if="page === 1" class="p-10 grow">
            <AccountInfo />
        </div>
        <div v-else-if="page === 2" class="p-10 grow">
            <Preferences />
        </div>
        <div v-else-if="page === 3" class="p-10 grow">
            <favUsers />
        </div>
    </div>
</template>

<style>
.sidebar-height {
    height: max(calc(100vh - 72px), 100%);
}
</style>