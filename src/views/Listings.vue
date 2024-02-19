<script>
    //import Listing.js from "/objects/Listing.js";
    //Listing1 = new Listing('Property1');
    import router from '../router/index'
    import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    import { ref } from 'vue';
    import { getFirestore, collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
    import { firebaseapp } from '../firebaseInit'
    /*export default {
  setup(){
    const listings = [
            { propertyName: 'Lafayette', address: '100 Lafayette Way', price: '$100' },
            { propertyName: 'Wiley Hall', address: '200 Wiley St', price: '$200' },
            { propertyName: 'Cedarwood', address: '300 Grant St', price: '$300' },
        ]
    return{listings}
    },*/
    export default {
        setup() {
            console.log('hello');
            //const listings = ref([]);
            const listings = [
            { propertyName: 'Lafayette', rating: '3.2', price: '$200' },
            { propertyName: 'Wiley Hall', rating: '3.1', price: '$100' },
            { propertyName: 'Cedarwood', rating: '3.3', price: '$300' },
            { propertyName: 'Tarkington Hall', rating: '3.0', price: '$400' },
        ];
            const fetchListings = async () => {
                console.log('bye');
                try {
                    
                    const db = getFirestore(firebaseapp);
                    const querySnapshot = await getDocs(collection(db, 'properties'));

                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        const propertyData = {
                            propertyName: data.propertyName,
                            rating: data.rating,
                            price: data.rent
                        };
                        listings.value.push(propertyData);
                    });

                } catch (error) {
                    console.error('Error fetching properties:', error);
                }
            };
            console.log(listings.length);
            return{listings};
        },
    
        data: function(){
            
            
            return{/*
            listings:[
            { propertyName: 'Lafayette', rating: '3.2', price: '$200' },
            { propertyName: 'Wiley Hall', rating: '3.1', price: '$100' },
            { propertyName: 'Cedarwood', rating: '3.3', price: '$300' },
            { propertyName: 'Tarkington Hall', rating: '3.0', price: '$400' },
        ],*/
            sortName: 'name',
            sortDir: 'asc',
            pageSize: 3,
            currentPage: 1,
            propertyHover: false
            };
        },
        /*created:function() {
            this.listings = [
            { propertyName: 'Lafayette', address: '100 Lafayette Way', price: '$100' },
            { propertyName: 'Wiley Hall', address: '200 Wiley St', price: '$200' },
            { propertyName: 'Cedarwood', address: '300 Grant St', price: '$300' },
        ]
        return{listings}
        },*/
        methods:{
            sort:function(s) {
            if(s === this.sortName) {
                this.sortDir = this.sortDir==='asc'?'desc':'asc';
            }
            this.sortName = s;
            },
            nextPage:function() {
                if((this.currentPage*this.pageSize) < this.listings.length) this.currentPage++;
            },
            prevPage:function() {
                if(this.currentPage > 1) this.currentPage--;
            },
            setPageSize:function(event) {
                this.pageSize = event.target.value;
            }
        },
        computed:{
            listings:function() {
                return this.listings.sort((a,b) => {
                    let modifier = 1;
                    if(this.sortDir === 'desc') modifier = -1;
                    if(a[this.sortName] < b[this.sortName]) return -1 * modifier;
                    if(a[this.sortName] > b[this.sortName]) return 1 * modifier;
                    return 0;
                }).filter((row, index) => {
                    let start = (this.currentPage-1)*this.pageSize;
                    let end = this.currentPage*this.pageSize;
                    if(index >= start && index < end) return true;
                
                });
            }

        }
    }
    

</script>

<style>
    .listingtext {
        color: black;
    }
    button {
        margin-right: 10px;
    }
</style>

<template>
    <div class="listingtext" style="width: 100%; display: flex;">
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('propertyName')">Property Name</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('rating')">Rating</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('rent')">Price</button>
    </div>
    <div class="listings" style="width: 100%; border: 1px solid blue; margin-top: 5px; margin-bottom: 5px;">
        <div v-show="propertyHover" style="width: 400px; height: 150px; border: 1px solid red; color: black; float: right;"></div>
        <table style="margin-left: 0; width: 50%; border: 1px solid green;">
            <tbody>
            <tr v-for="listing in listings" :key="listing.propertyName">
                <td>
                    <div @mouseover="propertyHover = true" @mouseleave="propertyHover = false" style="width: 400px; height: 150px; border: 1px solid black; color: black;">
                        Property Name: {{ listing.propertyName }} <br>
                        Rating: {{ listing.rating }} <br>
                        Price: {{ listing.rent }} <br>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        
    </div>
    <div class="listingtext" style="width: 100%; display: flex;">
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="prevPage">Previous</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="nextPage">Next</button>
        <select @change="setPageSize($event)">
            <option value="1">1</option>
            <option value="2">2</option>
            <option selected="selected" value="3">3</option>
        </select>
    </div>
    
</template>