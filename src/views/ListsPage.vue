<template>
    <div v-if="render">
        <div class="pageHeader">
            <h1> My Lists </h1>
            <div class="newListForm">
                <input class="biginput" v-model="newListName" />
                <button @click="createNewList()">Create New List</button>
            </div>
        </div>

        <div class="listSection" v-if="Object.keys(lists).length == 0">
            No lists
        </div>
        <div class="mainSection" v-else>
            <div class="listSection" v-for="(list, id) in lists" :key="list.listName">
                <div class="listHeading">
                    <div class="headingButtons" v-if="listToRename != id">
                        <span>{{list.listName}}</span>
                        <!-- edit -->
                        <!-- https://www.svgrepo.com/svg/521620/edit -->
                        <svg @click="listToRename=id" width="20px" height="20px" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#FFFFFF"/>
                        </svg>
                    </div>
                    <div class="headingButtons" v-else>
                        <input class="biginput" v-model="list.listName" />
                        <!-- checkmark -->
                        <!-- https://www.svgrepo.com/svg/532154/check -->
                        <svg class="check" @click="renameList()" width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>

                    <div class="headingButtons">
                        <!-- plus -->
                        <!-- https://www.svgrepo.com/svg/532997/plus-large -->
                        <svg @click="(addNewEntry == '') ? addNewEntry = id : addNewEntry = ''" width="25px" height="25px" viewBox="0 0 24 24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M12 4V20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        <!-- share -->
                        <!-- https://www.svgrepo.com/svg/523018/share -->
                        <svg @click="(share == '') ? share = id : share = ''" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 2.25C14.7051 2.25 13.25 3.70507 13.25 5.5C13.25 5.69591 13.2673 5.88776 13.3006 6.07412L8.56991 9.38558C8.54587 9.4024 8.52312 9.42038 8.50168 9.43939C7.94993 9.00747 7.25503 8.75 6.5 8.75C4.70507 8.75 3.25 10.2051 3.25 12C3.25 13.7949 4.70507 15.25 6.5 15.25C7.25503 15.25 7.94993 14.9925 8.50168 14.5606C8.52312 14.5796 8.54587 14.5976 8.56991 14.6144L13.3006 17.9259C13.2673 18.1122 13.25 18.3041 13.25 18.5C13.25 20.2949 14.7051 21.75 16.5 21.75C18.2949 21.75 19.75 20.2949 19.75 18.5C19.75 16.7051 18.2949 15.25 16.5 15.25C15.4472 15.25 14.5113 15.7506 13.9174 16.5267L9.43806 13.3911C9.63809 12.9694 9.75 12.4978 9.75 12C9.75 11.5022 9.63809 11.0306 9.43806 10.6089L13.9174 7.4733C14.5113 8.24942 15.4472 8.75 16.5 8.75C18.2949 8.75 19.75 7.29493 19.75 5.5C19.75 3.70507 18.2949 2.25 16.5 2.25ZM14.75 5.5C14.75 4.5335 15.5335 3.75 16.5 3.75C17.4665 3.75 18.25 4.5335 18.25 5.5C18.25 6.4665 17.4665 7.25 16.5 7.25C15.5335 7.25 14.75 6.4665 14.75 5.5ZM6.5 10.25C5.5335 10.25 4.75 11.0335 4.75 12C4.75 12.9665 5.5335 13.75 6.5 13.75C7.4665 13.75 8.25 12.9665 8.25 12C8.25 11.0335 7.4665 10.25 6.5 10.25ZM16.5 16.75C15.5335 16.75 14.75 17.5335 14.75 18.5C14.75 19.4665 15.5335 20.25 16.5 20.25C17.4665 20.25 18.25 19.4665 18.25 18.5C18.25 17.5335 17.4665 16.75 16.5 16.75Z" fill="#FFFFFF"/>
                        </svg>

                        <!-- trashcan -->
                        <svg @click="removeList(id)" fill="#FFFFFF" width="20px" height="20px" viewBox="-6.7 0 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 109.484 122.88" xml:space="preserve">
                            <g><path fill-rule="evenodd" clip-rule="evenodd" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></g>
                        </svg>
                    </div>
                </div>

                <div class="listHeading" v-if="share == id" style="margin-block: 4px;">
                    <div>
                        <span style="margin-right: 8px; font-size: 16px;">Share with:</span>
                        <input v-model="userToShareWith" />
                        <!-- checkmark -->
                        <!-- https://www.svgrepo.com/svg/532154/check -->
                        <svg class="check" @click="shareList()" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>

                <div class="listEntry" v-for="entry in list.entries" :key="entry.entryName">
                    <div class="listHeading">
                        <span>{{ entry.entryName }}:</span>
                        <span>{{ entry.entryLocation.lat }} {{ entry.entryLocation.lng }}</span>
                    </div>
                    <!-- trashcan -->
                    <svg @click="removeEntry(id, entry)" fill="#e8871b" width="20px" height="20px" viewBox="-6.7 0 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 109.484 122.88" xml:space="preserve">
                        <g><path fill-rule="evenodd" clip-rule="evenodd" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></g>
                    </svg>
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
        <div class="sharedlists" v-for="user in Object.keys(sharedLists)" :key="user">
            <div class="pageHeader">
                <h1> {{user}}'s Lists </h1>
            </div>
            <div class="listSection" v-for="(list, id) in sharedLists[user]" :key="list.listName">
                <div class="listHeading">
                    <div class="headingButtons" v-if="listToRename != id">
                        <span>{{list.listName}}</span>
                    </div>

                    <div class="headingButtons">
                        <!-- trashcan -->
                        <!-- implement removing shared lists from your view only?-->
                        <!-- 
                        <svg @click="" fill="#FFFFFF" width="20px" height="20px" viewBox="-6.7 0 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 109.484 122.88" xml:space="preserve">
                            <g><path fill-rule="evenodd" clip-rule="evenodd" d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"/></g>
                        </svg>
                        -->
                    </div>
                </div>

                <div class="listEntry" v-for="entry in list.entries" :key="entry.entryName">
                    <div class="listHeading">
                        <span>{{ entry.entryName }}:</span>
                        <span>{{ entry.entryLocation.lat }} {{ entry.entryLocation.lng }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        Loading...
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
                currentUser = store.getters.currentUser.username;
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

            const sharedListsSnapshot = await getDocs(query(collection(db, "lists"), where("sharedWith", "array-contains", store.getters.currentUser.username)))
            let sharedLists: {[key: string]: {[key: string]: Object}} = {};
            sharedListsSnapshot.forEach((currentdoc) => {
                try {
                    if (!sharedLists[currentdoc.data().user]) {
                        sharedLists[currentdoc.data().user] = {}
                    }
                    sharedLists[currentdoc.data().user][currentdoc.id] = currentdoc.data();
                } catch (error) {
                    console.log(error);
                    console.log(currentdoc.data());
                }
            });

            console.log(sharedLists);

            return {
                lists,
                sharedLists,
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
                newLocation: "",
                listToRename: "",
                share: "",
                userToShareWith: ""
            }
        },

        methods: {
            async createNewList() {
                if (this.newListName.trim() === "") {
                    return;
                }
                
                const newList = {
                    listName: this.newListName,
                    user: this.currentUser,
                    entries: [],
                    sharedWith: [],
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
                    } catch (error) {
                        console.log(error);
                        console.log(doc.data());
                    }
                });
                this.lists = lists;
                this.render = true;
            },
            async removeList(id: string) {
                const docToDelete = doc(this.db, "lists", id)
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
            },
            async removeEntry(id: string, entry: Object) {
                let listToUpdate = this.lists[id];
                listToUpdate.entries.splice(listToUpdate.entries.indexOf(entry), 1);
                await setDoc(doc(this.db, "lists", id), listToUpdate);
                await this.reload();
            },
            async renameList() {
                if (this.lists[this.listToRename].listName === "") {
                    return;
                }
                await setDoc(doc(this.db, "lists", this.listToRename), this.lists[this.listToRename]);
                this.listToRename = "";
                await this.reload();
            },
            async shareList() {
                if (this.userToShareWith === this.currentUser) {
                    this.userToShareWith = "";
                    return;
                }

                const usersSnapshot = await getDocs(query(collection(this.db, "users")));
                usersSnapshot.forEach(async (currentdoc) => {
                    if (currentdoc.data().username == this.userToShareWith) {
                        let list = this.lists[this.share];
                        list.sharedWith.push(this.userToShareWith);
                        await setDoc(doc(this.db, "lists", this.share), list);
                        this.share = this.userToShareWith = "";
                        await this.reload();
                    }
                });
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
        align-items: flex-end;
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
        font-size: 16px;
    }

    .biginput {
        font-size: 20px;
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
        width: 100%;
        flex-wrap: wrap;
    }

    svg {
        cursor: pointer;
        margin-left: 8px;
    }

    .headingButtons {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .newinput {
        width: 30%;
        margin-left: 4px;
    }

    .check {
        margin-left: 0px;
    }

    .share {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .sharedlists {
        margin-top: 32px;
    }

</style>