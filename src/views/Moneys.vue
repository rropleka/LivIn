<template>
    <h1>Calculate living expenses</h1>
    <button type="button" @click="toggle">Toggle</button>
    <div class="manual" id="manual">
        <div class="row">
            <div class="column">
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
                    <br>
                    <button v-on:click="calc" type="button">Calculate Breakdown</button>
                </form>
            </div>
        <div class="column"><div id="tester"></div>
    </div>
        </div>
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
useScriptTag('https://cdn.plot.ly/plotly-2.30.0.min.js')

export default {
    components: {
            
    },
    data() {
        return {
            form: {
                rent:0,
                food:0,
                transport:0,
                education:0,
                health:0,
                bills:0,
                other:0
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
        },
        calc() {
            let monthly = Number(this.form.rent)+Number(this.form.food)+Number(this.form.transport)+
            Number(this.form.education)+Number(this.form.health)+Number(this.form.bills)+Number(this.form.other);
            let totlabel = 'Total Per Month: $' + monthly;
            let plot = document.getElementById('tester');
            var data = [{
                values: [Number(this.form.rent), Number(this.form.food), Number(this.form.transport), Number(this.form.education), Number(this.form.health), Number(this.form.bills), Number(this.form.other)],
                labels: ['Rent', 'Food and Drink', 'Transportation', 'Education', 'Health', 'Bills', 'Other'],
                text: 'Hello',
                textposition: 'inside',
                hole: .6,
                type: 'pie'
            }];
            var layout = {
                height: 550,
                width: 800,
                annotations: [
                    {
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: totlabel,
                    x: 0.5,
                    y: 0.5
                    }
                ],
                margin: {l:0,r:100,t:35,b:0 }
            };
            Plotly.newPlot(plot, data, layout);
            console.log(monthly);
        }
    }
};
</script>

<style>
@media (min-width: 1024px) {
div {
    color: black;
}
h1{
    color: black;
}
h2{
    color: black;
}

}
.column {
  float: left;
  width: 30%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>