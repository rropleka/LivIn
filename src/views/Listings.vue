<script>
    //import Listing.js from "/objects/Listing.js";
    //Listing1 = new Listing('Property1');
    import router from '../router/index'
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
    
        data: function(){
            return{
            listings:[
            { propertyName: 'Lafayette', rating: '3.2', price: '$200' },
            { propertyName: 'Wiley Hall', rating: '3.1', price: '$100' },
            { propertyName: 'Cedarwood', rating: '3.3', price: '$300' },
            { propertyName: 'Tarkington Hall', rating: '3.0', price: '$400' },
        ],
            sortName:'name',
            sortDir:'asc',
            pageSize:3,
            currentPage:1
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
</style>

<template>
    <div class="listingtext">
        <button @click="sort('propertyName')">Property Name</button>
        <button @click="sort('rating')">Rating</button>
        <button @click="sort('price')">Price</button>
    </div>
    <div class="listingtext">
        <button @click="prevPage">Previous</button>
        <button @click="nextPage">Next</button>
    </div>
    <div class="listings">
        <table>
            <tbody>
            <tr v-for="listing in listings" :key="listing.propertyName">
                <td>
                    <div style="width: 400px; height: 150px; border: 1px solid black; color: black;">
                        Property Name: {{ listing.propertyName }} <br>
                        Rating: {{ listing.rating }} <br>
                        Price: {{ listing.price }} <br>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>