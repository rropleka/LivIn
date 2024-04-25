<template>
    <h1>Calculate living expenses</h1>
    <button class="toggle" type="button" @click="toggle">Toggle</button>
    <div class="myContent">
    <div class="manual" id="manual">
        <div class="row">
            <div class="column">
                <h3>Input an Estimate</h3>
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
            <div class="column" id="graph">
                <div id="tester"></div>
            </div>
        </div>
    </div>
    <div class="auto" id="auto" hidden="hidden">
        <div class="row">
            <div class="column">
                <h3>Input a Purchase</h3>
                <form>
                    <h2>Cost</h2>
                    <input type="number" v-model="form.cost" placeholder="" min="0">
                    <h2>Date</h2>
                    <input type="date" v-model="form.date" placeholder="">
                    <h2>Select a Category</h2>
                    <select v-model="form.cat" name="cat" id="cat">
                        <option disabled selected value> -- select a category -- </option>
                        <option value="Food">Food and Drink</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                        <option value="Bills">Bills</option>
                        <option value="Other">Other</option>
                    </select>
                    <br>
                    <button v-on:click="sub" type="button">Submit Expense</button>
                </form>
                <br>
                <h3>Load Spending Snapshot</h3>
                <form>
                    <h2>Start Date</h2>
                    <input type="date" v-model="form.start" placeholder="">
                    <h2>End Date</h2>
                    <input type="date" v-model="form.end" placeholder="">
                </form>
                <input type="checkbox" id="check" name="check" value="check">
                <label for="check">Include rent</label><br>
                <button v-on:click="load" type="button">Load Snapshot</button>
            </div>
            <div class="column" id="autograph">
                <div id="breakdown"></div>
            </div>
        </div>
    </div>
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
                other:0,
                cost:0,
                date:'',
                cat:'',
                start:'',
                end:''
            },
            loadPack: {
                
            },
            username:''
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
        toggle(props) {
            console.log("props: " + props.cost)
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
                height: document.getElementById("graph").parentNode.parentElement.clientHeight,
                width: document.getElementById("graph").parentNode.parentElement.clientWidth/2,
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
        },
        async sub() {
            const db = getFirestore(firebaseapp)
            if(this.form.date&&this.form.cat&&this.form.cost>0) {
                console.log("date: " + typeof this.form.date + this.form.cost + " cat: " + this.form.cat)
                const docRef = await addDoc(collection(db, "purchases"), {
                username: this.username,
                cost: this.form.cost,
                year: Number(this.form.date.substring(0,4)),
                month: Number(this.form.date.substring(5,7)),
                day: Number(this.form.date.substring(8,10)),
                category: this.form.cat,
                timestamp: Date.now()
                });
            } else {
                alert("Please fill in all fields");
            }
        },
        async load(props) {
            const db = getFirestore(firebaseapp)
            let startYear=1900
            let startMonth=1
            let startDay=1
            let endYear=2024
            let endMonth=12
            let endDay=31
            if (this.form.start) {
                startYear=Number(this.form.start.substring(0,4)),
                startMonth=Number(this.form.start.substring(5,7)),
                startDay=Number(this.form.start.substring(8,10))
            }
            if (this.form.end) {
                endYear=Number(this.form.end.substring(0,4)),
                endMonth=Number(this.form.end.substring(5,7)),
                endDay=Number(this.form.end.substring(8,10))
            }
            const querySnapshot = await getDocs(query(collection(db, 'purchases') 
            /*and(
            or(where('year', '>', startYear), and(where('year', '=', startYear),(where('month', '>', startMonth))), 
            and(where('year', '=', startYear),(where('month', '=', startMonth)),where('day', '>', startDay))),
            
            or(where('year', '<', endYear), and(where('year', '=', endYear),(where('month', '<', endMonth))), 
            and(where('year', '=', endYear),(where('month', '=', endMonth)),where('day', '<', endDay)))
            )*/));
            let foods = 0
            let fc=.0001
            let trans = 0
            let tc=.0001
            let ed = 0
            let ec=.0001
            let health = 0
            let hc=.0001
            let bills = 0
            let bc=.0001
            let other = 0
            let oc=.0001
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              let year=data.year
              let month=data.month
              let day=data.day
            
              if((year>startYear||(year==startYear&&month>startMonth)||(year==startYear&&month==startMonth&day>=startDay))
              &&(year<endYear||(year==endYear&&month<endMonth)||(year==endYear&&month==endMonth&day<=endDay))){
                const date = new Date();
                let cday = date.getDate();
                let cmonth = date.getMonth() + 1;
                let cyear = date.getFullYear();
                let currentDate = new Date(`${cday}/${cmonth}/${cyear}`);
                console.log(`${cmonth}/${cday}/${cyear}`);
                let paymentDate=new Date(`${month}/${day}/${year}`);
                let timeDiff=Date.now()-paymentDate.getTime()
                let daysDiffInMonths=(timeDiff / (1000 * 3600 * 24))/30.437;
                console.log("OG DATE: " + paymentDate + " diff: " + daysDiffInMonths);
                if (data.category=="Food" && data.cost) {
                    foods+=(data.cost)
                    if(daysDiffInMonths>fc){fc=daysDiffInMonths}
                } else if (data.category=="Transportation" && data.cost) {
                    trans+=(data.cost)
                    if(daysDiffInMonths>tc){tc=daysDiffInMonths}
                } else if (data.category=="Education" && data.cost) {
                    ed+=(data.cost)
                    if(daysDiffInMonths>ec){ec=daysDiffInMonths}
                } else if (data.category=="Health" && data.cost) {
                    health+=(data.cost)
                    if(daysDiffInMonths>hc){hc=daysDiffInMonths}
                } else if (data.category=="Bills" && data.cost) {
                    bills+=(data.cost)
                    if(daysDiffInMonths>bc){bc=daysDiffInMonths}
                } else if (data.cost) {
                    other+=(data.cost)
                    if(daysDiffInMonths>oc){oc=daysDiffInMonths}
                }
              }
            })
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const userDoc = currentUser.uid;
            const userDocRef = doc(db, 'users', userDoc);
            const userDocSnap = await getDoc(userDocRef);
            let anotherCost = userDocSnap.data().favPrice;
            /*onst querySnapshot2 = await getDocs(query(collection(db, 'users'), where('username', '==', username)))
            querySnapshot2.forEach((doc) => {
                anotherCost=doc.data().favPrice
            })*/
            if(!anotherCost) {
                anotherCost=0
            }
            foods=Number(foods)
            if(fc<1){fc=1}
            foods=Math.round((foods/fc) * 100) / 100
            trans=Number(trans)
            if(tc<1){tc=1}
            trans=Math.round((trans/tc) * 100) / 100
            ed=Number(ed)
            if(ec<1){ec=1}
            ed=Math.round((ed/ec) * 100) / 100
            health=Number(health)
            if(hc<1){hc=1}
            health=Math.round((health/hc) * 100) / 100
            bills=Number(bills)
            if(bc<1){bc=1}
            bills=Math.round((bills/bc) * 100) / 100
            other=Number(other)
            if(oc<1){oc=1}
            other=Math.round((other/oc) * 100) / 100
            let monthly = Number(foods+trans+ed+health+bills+other);
            monthly=Math.round((monthly) * 100) / 100
            console.log(monthly);
            let plot = document.getElementById('breakdown');
            let vals = [foods, trans, ed, health, bills, other]
            let labs = ['Food and Drink', 'Transportation', 'Education', 'Health', 'Bills', 'Other']
            console.log("props: " + anotherCost)
            if (document.getElementById("check").checked) {
                vals.push(anotherCost)
                labs.push('Rent')
                monthly+=anotherCost
            }
            monthly=Math.round((monthly) * 100) / 100
            let totlabel = 'Total Per Month: $' + monthly;
            console.log(monthly);
            var data = [{
                values: vals,
                labels: labs,
                text: 'Hello',
                textinfo:'value+percent',
                textposition: 'inside',
                hole: .6,
                type: 'pie'
            }];
            var layout = {
                height: document.getElementById("autograph").parentNode.parentElement.clientHeight,
                width: document.getElementById("autograph").parentNode.parentElement.clientWidth/2,
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
    margin: 10px;
    font-size: larger;
    font-weight: 600;
}
h2{
    color: black;
    font-weight: 450;
}
h3{
    color: black;
    font-weight: 550;
    font-size: large;
}

}
.column {
  float: left;
  width: 30%;
  padding-left: 10px
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
input[type='text'],input[type='number'],input[type='date'], input[type='checkbox'],select, textarea{
    color: black;
    border-width: 3px;
    border-style: dashed;
    border-color: teal;
    border-radius: 10px;
  }
  .myContent button[type='button']{
    background-color: cadetblue;
    margin: 5px;
    margin-left: 0px;
    padding: 5px;
    color: white;
    border-radius: 10px;
  }
  .myContent button[type='button']:hover {
    background-color: teal;
  }
  .toggle {
    background-color: orange;
    margin: 5px;
    margin-left: 10px;
    padding: 5px;
    color: black;
    border-radius: 10px;
  }
  .toggle:hover {
    background-color: orangered;
  }
  label {
    margin: 10px;
  }
</style>