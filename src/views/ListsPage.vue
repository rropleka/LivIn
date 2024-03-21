<template>
    <div class="pageHeader">
        <h1> {{currentUser}}'s Lists </h1>
        <div class="newListForm">
            <input :value="newListName" />
            <button>Create New List</button>
        </div>
    </div>


    <div class="listSection" v-if="Object.keys(lists) == 0">
        No lists
    </div>
    <div v-else>
        <div class="listSection" v-for="list in lists" :key="list.listName">
            <div class="listName">
                {{list.listName}}
            </div>
            <div class="listEntry" v-for="entry in list.entries" :key="entry.entryName">
                <span>{{ entry.entryName }}:</span>
                <span>{{ entry.entryLocation.lat }} {{ entry.entryLocation.lng }}</span>
            </div>
        </div>
    </div>
</template>

<script type="ts">
    import { useStore } from "vuex";
    import { getFirestore, collection, doc, getDocs, setDoc, addDoc, query, where } from 'firebase/firestore/lite'
    import { firebaseapp } from '../firebaseInit'
    export default {
        async setup() {
            const db = getFirestore(firebaseapp)
            const store = useStore();

            let currentUser = ""
            if (store.getters.currentUser) {
                currentUser = store.getters.currentUser.email;
            }

            const listsSnapshot = await getDocs(query(collection(db, "lists"), where("user", "==", currentUser)));
            let lists = {};
            listsSnapshot.forEach((doc) => {
                try {
                    lists[doc.id] = JSON.parse(doc.data());
                } catch (error) {
                    console.log("Misformatted favorite, skipping");
                }
            });
            console.log(lists);

            lists["DEBUG"] = {
                listName: "DEBUG",
                entries: [
                    {
                        entryName: "TEST ENTRY",
                        entryLocation: { lat: 40.420781, lng: -86.918061 }
                    },
                    {
                        entryName: "TEST ENTRY",
                        entryLocation: { lat: 40.420781, lng: -86.918061 }
                    },
                    {
                        entryName: "TEST ENTRY",
                        entryLocation: { lat: 40.420781, lng: -86.918061 }
                    },
                ]
            }

            return {
                lists,
                db,
                store,
                currentUser
            }

        },

        data() {
            return {
                renderLists: true,
                selectedFavorite: "",
            }
        },
    }
</script>

<style scoped>
    h1 {
        color: black;
        font-size: large;
    }

    .listSection{
        width: 33%;
        display: flex;
        border-radius: 4px;
        background-color: #e8871b;
        color: white;
        padding: 10px;
        margin-top: 10px;
        flex-direction: column;
        font-size: 20px;
    }

    .listEntry {
        width: 100%;
        display: flex;
        background-color: white;
        border-top: #e8871b solid 2px;
        color: #e8871b;
        padding: 2px 8px;
        justify-content: space-between;
        font-size: 16px;
    }

    .pageHeader {
        margin-top: 4px;
        font-size: 20px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        padding-inline: 10px;
    }

    .page {
        padding: 20px;
    }

    .newListForm {
        color: black;
    }

    input {
        color: black;
        border: lightgray solid 1px;
        border-radius: 2px;
        margin-right: 10px;
    }

    button {
        background-color: #e8871b;
        color: white;
        border-radius: 2px;
        padding-inline: 8px;
    }
</style>