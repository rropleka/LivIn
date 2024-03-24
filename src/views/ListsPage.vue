<template>
    <div v-if="render">
        <div class="pageHeader">
            <h1> {{currentUser}}'s Lists </h1>
            <div class="newListForm">
                <input v-model="newListName" />
                <button @click="createNewList()">Create New List</button>
            </div>
        </div>


        <div class="listSection" v-if="Object.keys(lists).length == 0">
            No lists
        </div>
        <div class="mainSection" v-else>
            <div class="listSection" v-for="(list, id) in lists" :key="list.listName">
                <div class="listHeading">
                    {{list.listName}}

                    <div class="headingButtons">
                        <!-- plus -->
                        <!-- https://www.svgrepo.com/svg/532997/plus-large -->
                        <svg @click="(addNewEntry == '') ? addNewEntry = id : addNewEntry = ''" width="20px" height="20px" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M12 4V20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        <!-- trashcan -->
                        <svg @click="removeList(id)" fill="#FFFFFF" width="20px" height="20px" viewBox="-6.7 0 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 109.484 122.88" xml:space="preserve">
                            <g><path fill-rule="evenodd" clip-rule="evenodd" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></g>
                        </svg>
                    </div>
                </div>
                <div class="listEntry" v-for="entry in list.entries" :key="entry.entryName">
                    <span>{{ entry.entryName }}:</span>
                    <span>{{ entry.entryLocation.lat }} {{ entry.entryLocation.lng }}</span>
                </div>
                <div class="listEntry" v-if="addNewEntry == id">
                    <label for="newname">Name: </label>
                    <input id="newname" v-model="newName" class="newinput"/>
                    <label for="newlocation">Location: </label>
                    <input id="newlocation" v-model="newLocation" class="newinput"/>

                    <!-- checkmark -->
                    <!-- https://www.svgrepo.com/svg/532154/check -->
                    <svg @click="createEntry()" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#e8871b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { useStore } from "vuex";
    import { getFirestore, collection, doc, getDocs, setDoc, addDoc, query, where, deleteDoc } from 'firebase/firestore/lite'
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
            let lists: {[key: string]: Object} = {};
            listsSnapshot.forEach((doc) => {
                try {
                    lists[doc.id] = doc.data();
                    console.log(doc.data());
                } catch (error) {
                    console.log(error);
                    console.log(doc.data());
                }
            });
            console.log(lists);

            lists["DEBUG"] = {
                listName: "DEBUG",
                user: "moderator@gmail.com",
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
                currentUser,
            }

        },

        data() {
            return {
                render: true,
                newListName: "",
                addNewEntry: "",
                newName: "",
                newLocation: ""
            }
        },

        methods: {
            async createNewList() {
                if (this.newListName.trim() === "") {
                    console.log("Empty name");
                    return;
                }
                
                const newList = {
                    listName: this.newListName,
                    user: this.currentUser,
                    entries: []
                }
                try {
                    const listsRef = collection(this.db, "lists");
                    await addDoc(listsRef, newList)
                } catch (error) {
                    console.log(error);
                }

                this.newListName = "";

                await this.reload();
            },
            async reload() {
                this.render = false;

                const listsSnapshot = await getDocs(query(collection(this.db, "lists"), where("user", "==", this.currentUser)));
                let lists: {[key: string]: Object} = {};
                listsSnapshot.forEach((doc) => {
                    try {
                        lists[doc.id] = doc.data();
                        console.log(doc.data());
                    } catch (error) {
                        console.log(error);
                        console.log(doc.data());
                    }
                });
                this.lists = lists;
                console.log(this.lists);

                this.render = true;
            },
            async removeList(id: string) {
                console.log(id);

                const docToDelete = doc(this.db, "lists", id)
                console.log(`${docToDelete}`);
                await deleteDoc(docToDelete)
                .catch((error: any) => {
                    console.log(error);
                })

                await this.reload();
            },
            async createEntry() {
                if ((this.newName === "") || (this.newLocation === "")) {
                    return;
                }
                
                let coords = {lat: 999, lng: 999};
                const splitString = this.newLocation.split(" ");
                coords.lat = parseFloat(splitString[0]);
                coords.lng = parseFloat(splitString[1]);
                if (isNaN(coords.lat) || isNaN(coords.lng)) {
                    console.log("Improperly formatted coordinates");
                    return;
                }

                let listToUpdate = this.lists[this.addNewEntry];
                let newEntry = {
                    entryName: this.newName,
                    entryLocation: coords
                }
                listToUpdate.entries.push(newEntry);
                await setDoc(doc(this.db, "lists", this.addNewEntry), listToUpdate);
                this.newName = this.newLocation = this.addNewEntry = "";
                await this.reload();
            }
        }
    }

</script>

<style scoped>
    h1 {
        color: black;
        font-size: large;
    }

    .listSection{
        width: calc(33% - 10px);
        display: flex;
        border-radius: 4px;
        background-color: #e8871b;
        color: white;
        padding: 10px;
        margin-top: 10px;
        flex-direction: column;
        font-size: 20px;
        margin-inline: 5px;
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

    .mainSection {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .listHeading {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    svg {
        cursor: pointer;
    }

    .headingButtons {
        display: flex;
        flex-direction: row;
    }

    .newinput {
        width: 30%;
        margin-left: 4px;
    }
</style>