<template>
    <h1>Calculate living expenses</h1>
    
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

    }
};
</script>

<style>
@media (min-width: 1024px) {

}
</style>