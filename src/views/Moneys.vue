<template>
    <h1>Calculate living expenses</h1>
    <button type="button" @click="toggle">Toggle</button>
    <div class="manual" id="manual">
        <form>
            <h2>Rent</h2>
            <input type="number" v-model="form.rent" placeholder="" min="0">
            <h2>Food and Drink</h2>
            <input type="number" v-model="form.food" placeholder="" min="0">
            <h2>Transportation</h2>
            <input type="number" v-model="form.transport" placeholder="" min="0">
            <h2>Education</h2>
            <input type="number" v-model="form.education" placeholder="" min="0">
            <h2>Health</h2>
            <input type="number" v-model="form.health" placeholder="" min="0">
            <h2>Bills</h2>
            <input type="number" v-model="form.bills" placeholder="" min="0">
            <h2>Other</h2>
            <input type="number" v-model="form.other" placeholder="" min="0">
        </form>
    </div>
    <div class="auto" id="auto" hidden="hidden">
        <h2>Hello World</h2>
    </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {ref} from 'vue';
import router from '../router/index'
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, where, deleteDoc, addDoc, updateDoc, Firestore, DocumentReference, orderBy } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import { useScriptTag } from '@vueuse/core'
useScriptTag('https://www.kryogenix.org/code/browser/sorttable/sorttable.js')

export default {
    components: {
            
    },
    data() {
        return {
            form: {

            },
            loadPack: {
                
            }
        }
    }, 
    async beforeMount() {
        const db = getFirestore(firebaseapp)
        try {
            console.log("temp");
        } catch(error) {
            // Handle any errors
            const errorMessage = error;
            alert(errorMessage);
        }

    },
    methods: {
        toggle() {
            let manual = document.getElementById("manual");
            let auto = document.getElementById("auto");
            let hidden = manual.getAttribute("hidden");
            if(hidden) {
                auto.setAttribute("hidden", "hidden");
                manual.removeAttribute("hidden");
            } else {
                manual.setAttribute("hidden", "hidden");
                auto.removeAttribute("hidden");
            }
        }
    }
};
</script>

<style>
@media (min-width: 1024px) {
h1{
    color: black;
}
h2{
    color: black;
}

}
</style>