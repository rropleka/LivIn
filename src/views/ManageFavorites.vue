<script lang="ts">
import { getFirestore, collection, doc, getDocs, setDoc, addDoc, query, where, deleteDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../firebaseInit'
import {defineComponent} from "vue";
import {useStore} from "vuex";

export default defineComponent ({
    async setup() {
        const store = useStore();
        let currentUser = store.getters.currentUser;

        const db = getFirestore(firebaseapp);

        const favoritesSnapshot = await getDocs(query(collection(db, 'favorites'), where('user', '==', currentUser)));
        let favoritesList: {
            [key: string]: any;
        } = {};
        favoritesSnapshot.forEach((doc) => {
            try {
                const data = doc.data();
                const coords = JSON.parse(data.coords);
                const coordsString = `${coords.lat} ${coords.lng}`
                favoritesList[coordsString] = doc.ref.id;
            } catch (error) {
            console.log("Misformatted favorite, skipping");
            }
        })

        return {
            db,
            favorite: "",
            currentUser,
            favoritesList,
        }
    },
    data() {
        return {
            renderSelect: true,
            selectedFavorite: "",
        }
    },
    methods: {
        async addFavorite() {
            if (this.favorite == "") {
                console.log("Blank favorite");
                return;
            }
            let coords = {lat: 999, lng: 999};

            const splitString = this.favorite.split(" ");
            coords.lat = parseFloat(splitString[0]);
            coords.lng = parseFloat(splitString[1]);
            if (isNaN(coords.lat) || isNaN(coords.lng)) {
                console.log("Improperly formatted coordinates");
                return;
            }
            console.log("Can add hotspot");
            try {
                const hotspotsRef = collection(this.db, "favorites");
                await addDoc(hotspotsRef, {
                    user: this.currentUser,
                    coords: JSON.stringify(coords),
                })
            } catch (error) {
                console.log(error);
            }
            await this.reload();

        },
        async reload() {
            this.renderSelect = false;
            console.log(this.favoritesList);
            const favoritesSnapshot = await getDocs(query(collection(this.db, 'favorites'), where('user', '==', this.currentUser)));
            let favoritesList: {
                [key: string]: any;
            } = {};
            favoritesSnapshot.forEach((doc) => {
                try {
                    const data = doc.data();
                    const coords = JSON.parse(data.coords);
                    const coordsString = `${coords.lat} ${coords.lng}`
                    favoritesList[coordsString] = doc.ref.id;
                } catch (error) {
                console.log("Misformatted favorite, skipping");
                }
            })
            this.favoritesList = favoritesList;
            console.log(this.favoritesList);
            console.log(this.renderSelect);
            this.renderSelect = true;
        },
        async deleteFavorite() {
            if (this.selectedFavorite == "") {
                return;
            }

            console.log(`deleting ${this.selectedFavorite}`);

            const docToDelete = doc(this.db, "favorites", this.selectedFavorite)
            console.log(`${docToDelete}`);
            await deleteDoc(docToDelete)
            .catch(error => {
                console.log(error);
            })


            this.selectedFavorite = "";
            this.reload();
        }
    }
})

</script>

<template>
    <main >
        <h1>Add Favorite Locations</h1>
        <form @submit.prevent="addFavorite">
            <input type="text" placeholder="Favorite" v-model="favorite" class="black-text"/>
            <button type="submit">Add Favorite Location</button>
        </form>
        <h1 >Remove Favorite Locations</h1>
        <form @submit.prevent="deleteFavorite" v-if="renderSelect">
            <select v-model="selectedFavorite" >
                <option value="" disabled/>
                <option v-for="[key, value] in Object.entries(favoritesList)" :key="key" :value="value">{{ key }}</Option>
            </select>
            <button type="submit">Remove Favorite Location</button>
        </form>

    </main>
</template>

<style scoped>
    form, h1 {
        color: black;
        display: flex;
        flex-direction: column;
        width: 33%;
    }
    main {
        display: flex;
        flex-direction: column;
    }
</style>