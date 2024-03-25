<script lang="ts">
    import { computed, ref, onMounted } from 'vue'
    import { useStore } from 'vuex'; 
	import { initDropdowns } from 'flowbite';
	import { getDoc, doc, getFirestore } from 'firebase/firestore/lite';

    export default {
        setup() {
            const store = useStore();


            const isLoggedIn = computed(() => store.getters.isLoggedIn);
			const currentUser = computed(() => store.getters.currUserCopy).value; 
			console.log("currUserCopy", currentUser)
			
			const isModerator = ref(false)
            const isLeasingCompany = ref(true);
			
            const logout = () => {
				store.dispatch('logoutUser')
				isModerator.value = false
			};

			// function to check if moderator is logged in
			const fetchModeratorStatus = async () => {
				/* Setup for logged user query */
				const db = getFirestore()
				// const currentUser = auth.currentUser;
				if (currentUser === null) {
					isModerator.value = false
					return
				}
				const currentUserID = currentUser.uid;
	
				try {
					const userDocRef = doc(db, 'users', currentUserID);
					const userDocSnap = await getDoc(userDocRef);
	
					/* Set moderator flag to allow delete button to appear */
					if (userDocSnap.exists()) {
						const userData = userDocSnap.data();
						console.log(userData);
						if (userData.userType) {
							if (userData.userType == "sitemoderator") {
								isModerator.value = true
							} else {
								isModerator.value = false
							}
						}
					} else {
						console.error('User data does not exist.');
					}
				} catch (error: any) {
					console.error('Error fetching user data:', error.message);
				}
			}

			// Call fetchModeratorStatus when the component is mounted
			fetchModeratorStatus();
			console.log("isModerator",isModerator)

            return {
                isLoggedIn,
                logout,
                isLeasingCompany,
				isModerator
            }
        },
        mounted() {
            initDropdowns()
        },
		updated() {
			initDropdowns()
		},

    }
</script>

<template>
<div class="p-0 m-0">
  <nav class=" bg-orange-300 p-0 my-0 border-gray-200 dark:bg-gray-900">
    <div class=" flex flex-wrap items-center justify-between mx-5 p-4">
		<router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src="../assets/LivInLogo.png" class="h-8" alt="LivIn' Logo" />
		</router-link>
		<div class="hidden w-full md:block md:w-auto" id="navbar-default">
			<ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
			<li>
				<!-- Dropdown button for properties -->
				<button id="dropdownPropOptionsBtn" data-dropdown-toggle="dropdownPropOptions" data-dropdown-trigger="hover" data-dropdown-placement="bottom" class="text-white bg-orange-300  font-default-font rounded-lg text-md px-2.5 py-1.5 text-center inline-flex items-center " type="button">
					Property
					<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
					</svg>
				</button>

				<!-- Dropdown menu for properties -->
				<div id="dropdownPropOptions" class="z-10 hidden bg-light-orange rounded-lg shadow">
				<ul class=" py-2 overflow-y-auto text-gray-700 dark:text-gray-200">
					<li> 
						<router-link to="/compare"  class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Compare</router-link>
					</li>
					<li>
						<router-link to="/listings" class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Properties</router-link>
					</li>
					<li v-if="isLoggedIn">
						<router-link to="/revprop" class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Review Property</router-link>
					</li>
					<li v-if="isLoggedIn && isLeasingCompany">
						<router-link to="/add-property" class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Add Property</router-link>
					</li>

				</ul>
				</div>
			</li>
			
			<div v-if="isLoggedIn" class="flex flex-row">
				<li>
					<!-- Dropdown button for user -->
					<button id="dropdownUserOptionsBtn" data-dropdown-toggle="dropdownUserOptions" data-dropdown-trigger="hover" data-dropdown-placement="bottom" class="text-white bg-orange-300  font-default-font rounded-lg text-md px-2.5 py-1.5 text-center inline-flex items-center " type="button">
						User
						<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
						</svg>
					</button>

					<!-- Dropdown menu for user -->
					<div id="dropdownUserOptions" class="z-10 hidden bg-light-orange rounded-lg shadow">
						<ul class=" py-2 overflow-y-auto text-gray-700 dark:text-gray-200">
							<li>
								<router-link to="/Profile" class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Profile</router-link>
							</li>
							<li>
								<router-link to="/lists" class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Lists</router-link>
							</li>
							<li @click.prevent="logout">
								<router-link to="/"  class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Logout</router-link>
							</li>
							<li>
								<router-link to="/search-users"  class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Search Users</router-link>
							</li>
							<li v-if="isLoggedIn && isModerator">
								<router-link to="/check-reports" class="block text-center py-1 px-8 md:bg-light-orange md:text-white text-lg font-default-font">Reports</router-link>
							</li>
						</ul>
					</div>
				</li>
			</div>
			<div v-else>
				<li>
					<router-link to="/login" class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font">Signup / Login</router-link>
				</li>
			</div>
			</ul>
		</div>
    </div>
  </nav>
</div>
</template>

