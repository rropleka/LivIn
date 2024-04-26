<script>
    import router from '../router/index'
    import { getFirestore, collection, getDocs, query, where, setDoc } from 'firebase/firestore/lite'
    import { firebaseapp } from '../firebaseInit'


    export default {  
        //async method to get all listings from firebase
        async mounted () {
            try {
                const listingsData = await this.getListings();
                if (listingsData) {
                    this.listings = listingsData;
                } else {
                    router.push({ listings: [] });
                }
            } catch (error) {
                console.error("Error fetching listings data:", error);
            }
        },
        data() {
            return {
                searchAmenity: '',
                listings: [],
                property: [],
                sortName: 'name',
                sortDir: 'asc',
                pageSize: 3,
                currentPage: 1,
                propertyHover: false,
                maxPrice: null,
                maxSubleaseCount: null, // Added property for filtering by min number of subleases
                sortedListings: []
            };
        },
        methods: {
            sort(s) {
                if (s === this.sortName) {
                    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
                }
                this.sortName = s;
            },
            nextPage() {
                if ((this.currentPage * this.pageSize) < this.listings.length) this.currentPage++;
            },
            prevPage() {
                if (this.currentPage > 1) this.currentPage--;
            },
            setPageSize(event) {
                this.pageSize = event.target.value;
            },
            goToPropertyPage:function(propertyURL) {
                router.push({ path: propertyURL });
            },
            //takes user to page in table with property
            goToProperty:function(propertyName) {
                let foundIndex = 0;
                for (let i = 0; i < this.sortedListings.length; i++) {
                    if (this.sortedListings[i].propertyName === propertyName) {
                        foundIndex = i;
                        break;
                    }
                }
                if (this.currentPage != Math.floor(foundIndex / this.pageSize) + 1) {
                    this.currentPage = Math.floor(foundIndex / this.pageSize) + 1;
                }
            },
            //return all listings in an array
            async getListings() {
                try {
                    const db = getFirestore(firebaseapp);
                    const querySnapshot = await getDocs(collection(db, 'properties'));

                    if (querySnapshot.empty) {
                        return false;
                    }
                    const listingsArray = [];

                    querySnapshot.forEach(async doc => {
                        const propertyData = doc.data();
                        console.log(propertyData);
                        if (!propertyData.subleaseCount) {
                            propertyData.subleaseCount = 0;
                            // await setDoc(doc.ref, { ...propertyData, subleaseCount: 0 }, { merge: true });
                        }
                        listingsArray.push(propertyData);
                    });
                    return listingsArray;
                } catch (error) {
                    console.error('Error checking property existence:', error);
                    return null;
                }
            },
            async getPropertyData(propertyName) {
                try {
                    const db = getFirestore(firebaseapp);
                    const collectionRef = collection(db, 'properties');
                    const querySnapshot = await getDocs(query(collectionRef, where("propertyName", "==", propertyName)));

                    if (querySnapshot.empty) {
                        return false;
                    }
                    const propertyData = querySnapshot.docs[0].data();

                    this.property = propertyData;
                } catch (error) {
                    console.error('Error checking property existence:', error);
                    return null;
                }
            },
        },
        computed: {
            listings() {
                return this.listings
                    .filter(listing => {
                        if (this.maxPrice === null) {
                            return true; // Show all properties when maxPrice is empty
                        } else {
                            return listing.rent <= this.maxPrice; // Filter by maxPrice
                        }
                    })
                    .filter(listing => {
                if (!this.searchAmenity) {
                    return true; // Show all properties when searchAmenity is empty
                } else {
                    return listing.amenities && listing.amenities.some(amenity =>
                        amenity.toLowerCase().includes(this.searchAmenity.toLowerCase())
                    ); // Filter by matching amenities if amenities array is not null or undefined
                }
            })
                    .sort((a, b) => {
                        let modifier = 1;
                        if (this.sortDir === 'desc') modifier = -1;
                        if (a[this.sortName] < b[this.sortName]) return -1 * modifier;
                        if (a[this.sortName] > b[this.sortName]) return 1 * modifier;
                        return 0;
                    }).filter((row, index) => {
                        let start = (this.currentPage - 1) * this.pageSize;
                        let end = this.currentPage * this.pageSize;
                        if (index >= start && index < end) return true;
                    });
            }
        }
    }
</script>

<style>
    .listingtext {
        color: black;
    }
    .propertydiv {
        width: 400px;
        height: 150px;
        border: 1px solid black;
        color: black;
        padding-left: 5px;
    }
    button {
        margin-right: 10px;
        margin-top: 5px;
    }
</style>

<template>
    <div class="listings-page" v-if="listings">
            <div class="listingtext" style="width: 100%; display: flex;">
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('propertyName')" style="width: 175px;">Property Name</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('rating')">Rating</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('rent')">Price</button>
        <input type="number" v-model="maxPrice" placeholder="Enter max price">
    </div>
            <input type="number" v-model="maxSubleaseCount" placeholder="min amount of subleases">
    <div class="listings" style="width: 100%; margin-top: 5px;">
            <input type="text" v-model="searchAmenity" placeholder="Search amenities">
        <table style="margin-left: 0; width: 50%; border: 1px solid black; box-shadow: 6px 0 5px -2px #888;">
            <tbody>
            <tr v-for="listing in listings" :key="listing.propertyName">
                <td>
                    <div v-bind:id="listing.propertyName" class="propertydiv" @mouseover="propertyHover = true, getPropertyData($event.target.id)" @mouseleave="propertyHover = false">
                        Property Name: {{ listing.propertyName }} <br>
                        Rating: {{ listing.rating }} <br>
                        Price: {{ listing.rent }} <br>
                        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="goToPropertyPage('/' + property.owner + '/' + property.propertyName)">Go to Property Page</button>
                    </div>

                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="listingtext" style="width: 100%; display: flex;">
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="prevPage">Previous</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="nextPage">Next</button>
        <p style="margin: auto 10px auto 0px">Properties per Page</p>
        <select @change="setPageSize($event)">
            <option value="1">1</option>
            <option value="2">2</option>
            <option selected="selected" value="3">3</option>
        </select>
    </div>
    <div v-show="propertyHover" class="propertydiv" style="float: bottom;">
            Amenities: <span v-for="(amenity, index) in this.property.amenities">
                {{ amenity }}{{ (index+1 < this.property.amenities.length) ? ', ' : '' }}
            </span> <br>
            Owner: {{ this.property.owner }} <br>
            Property Size: {{ this.property.propertySize }} <br>
            Location: {{ this.property.location }} <br>
            Sublease Count: {{ this.property.subleaseCount }} <br>
        </div>
    </div>
</template>
