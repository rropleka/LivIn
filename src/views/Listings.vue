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
            { propertyName: 'Lafayette', address: '100 Lafayette Way', price: '$200' },
            { propertyName: 'Wiley Hall', address: '200 Wiley St', price: '$100' },
            { propertyName: 'Cedarwood', address: '300 Grant St', price: '$300' },
        ],
            currentSort:'name',
            currentSortDir:'asc',
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
            //if s == current sort, reverse
            if(s === this.currentSort) {
                this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
            }
            this.currentSort = s;
            }
        },
        computed:{
            listings:function() {
            return this.listings.sort((a,b) => {
                let modifier = 1;
                if(this.currentSortDir === 'desc') modifier = -1;
                if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
                return 0;
            });
            }
        }

    }
//}
</script>

<style>
    .listingtext {
        color: black;
    }
</style>

<template>
    <div class="listingtext">
        <button @click="sort('propertyName')">Property Name</button>
        <button @click="sort('address')">Address</button>
        <button @click="sort('price')">Price</button>
    </div>
    <div class="listings">
        <table>
            <tbody>
            <tr v-for="listing in listings" :key="listing.propertyName">
                <td>
                    <div style="width: 400px; height: 150px; border: 1px solid black; color: black;">
                        Property Name: {{ listing.propertyName }} <br>
                        Address: {{ listing.address }} <br>
                        Price: {{ listing.price }} <br>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>