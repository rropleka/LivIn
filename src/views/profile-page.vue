<script setup>
import AccountInfo from '../components/account-info.vue'
</script>

<template>
    <div>
        <aside id="default-sidebar" class="fixed left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
            <div class="h-full px-3 py-4 overflow-y-auto bg-light-orange">
                <ul class="space-y-2 font-medium">
                    <li>
                        <router-link to="/" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-200 group">
                            <svg class="w-5 h-5 fill-light-orange group-hover:fill-dark-orange" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Account info</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-200 group">
                            <svg class="w-5 h-5 fill-light-orange group-hover:fill-dark-orange" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Favorite locations</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-200 group">
                            <svg class="w-5 h-5 fill-light-orange group-hover:fill-dark-orange" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Saved Properties</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-blue-200 group">
                            <svg class="w-5 h-5 fill-light-orange group-hover:fill-dark-orange" xmlns="http://www.w3.org/2000/svg">
                                <circle r="8" cx="10" cy="10"></circle>
                            </svg>
                            <span class="text-white text-lg ms-3">Saved lists</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </aside>
        <div class="p-10 sm:ml-64">
            <AccountInfo />
        </div>
    </div>
</template>