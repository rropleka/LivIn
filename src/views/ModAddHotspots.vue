<script lang="ts">
import { getFirestore, collection, doc, getDocs, setDoc, addDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../firebaseInit'
import {defineComponent} from "vue";


export default defineComponent ({
    setup() {
        return {
            db: getFirestore(firebaseapp),
            campus: "",
            hotspot: ""
        }
    },
    methods: {
        async addHotspot() {
            if (this.campus == "" || this.hotspot == "") {
                console.log("Blank campus or hotspot");
                return;
            }
            let coords = {lat: 999, lng: 999};

            const splitString = this.hotspot.split(" ");
            coords.lat = parseFloat(splitString[0]);
            coords.lng = parseFloat(splitString[1]);
            if (isNaN(coords.lat) || isNaN(coords.lng)) {
                console.log("Improperly formatted coordinates");
                return;
            }
            console.log("Can add hotspot");

            const hotspotsRef = collection(this.db, "hotspots");
            await addDoc(hotspotsRef, {
                campus: this.campus,
                coords: coords
            })
        }
    }
})

</script>

<template>
    <main>
        <h1>Moderator: Add Hotspots for Campus</h1>
        <form @submit.prevent="addHotspot">
            <input type="text" placeholder="Campus" v-model="campus" class="black-text"/>
            <input type="text" placeholder="Hotspot" v-model="hotspot" class="black-text"/>
            <button type="submit">Add Hotspot</button>
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
</style>