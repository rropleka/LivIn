<template>
    <h1>List of Lenders by Rating</h1>
    <div class="whole">
        <table class="sortable" id="table">
            <tr>
                <th class="sorttable_nosort">Name</th>
                <th class="sorttable_numeric">Rating</th>
                <th class="sorttable_nosort">Number of Reviews</th>
            </tr>
            <tr>
                <td>filleruser1</td>
                <td>3.65</td>
                <td>34</td>
            </tr>
            <tr>
                <td>filleruser2</td>
                <td>4.62</td>
                <td>12</td>
            </tr>
            <tr>
                <td>filleruser3</td>
                <td>1.98</td>
                <td>7</td>
            </tr>
        </table>
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
            loadPack: {
                
            }
        }
    }, 
    async beforeMount() {
        const db = getFirestore(firebaseapp)
        try {
            const querySnapshot = await getDocs(query(collection(db,'users'), where('userType', '==', 'leasingCompany')));
            const table = document.getElementById('table')
            querySnapshot.forEach((doc) => {
                const data = doc.data()
              if((data.totalReviews>=0&&data.totalScore>=0)&&data.username) {
                var row = table.insertRow(-1);
                var name = row.insertCell(0);
                var rating = row.insertCell(1);
                var num = row.insertCell(2);
                name.innerHTML=data.username;
                //rating.innerHTML='2.6'
                rating.innerHTML=`${(data.totalScore/data.totalReviews).toFixed(2)}`;
                num.innerHTML=`${data.totalReviews}`;
              }
            })
            querySnapshot.forEach((doc) => {
                const data = doc.data()
              if(!(data.totalReviews>=0&&data.totalScore>=0)&&data.username) {
                var footer = table.createTFoot();
                var row = footer.insertRow(-1);
                var name = row.insertCell(0);
                var rating = row.insertCell(1);
                var num = row.insertCell(2);
                name.innerHTML=data.username;
                //const ratingScore = data.totalScore/data.totalReviews;
                rating.innerHTML='No Reviews Yet'
                num.innerHTML=`0`;
                //rating.innerHTML=`${rating}`;
              }
            })

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
    h1 {
        color:black;
        padding: 10px;
        font-size: 24px;
        font-weight: 600;
    }
    .sortable {
        text-align: left;
        color:black;
        border-width: 5px;
        border-style: dashed;
        border-color: orange;
        border-radius: 10px;
        font-size: 24px;
        margin: 10px;
    }
    .sortable th {
        min-width: fit-content;
        padding: 5px;
        margin: 5px;
        background-color: #ffe4c4;
    }
    .sortable th:hover {
        background-color: #ddc2a2;
    }
    .sortable th, td {
        padding: 5px;
        border-width: 3px;
        border-style: dashed;
        border-color: orange;
        border-radius: 4px; 
    }
    .sortable td:hover {
        background-color: lightgray;
    }

}
</style>