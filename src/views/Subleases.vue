<template>
    <div class="subleases-page" v-if="subleases">
      <div class="listingtext" style="width: 100%; display: flex;">
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('propertyName')" style="width: 175px;">Property Name</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('subleasePrice')">Price</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="sort('duration')">Duration</button>
        <input type="number" v-model="minDuration" placeholder="Enter min duration">
        <input type="number" v-model="minCost" placeholder="Enter min cost"> <!-- New input for min cost -->
        <input type="number" v-model="maxCost" placeholder="Enter max cost"> <!-- New input for max cost -->
      </div>
      <div class="listings" style="width: 100%; margin-top: 5px;">
        <table style="margin-left: 0; width: 50%; border: 1px solid black; box-shadow: 6px 0 5px -2px #888;">
          <tbody>
            <tr v-for="(sublease, index) in paginatedSubleases" :key="sublease.id">
              <td>
                <div class="propertydiv">
                  Property Name: {{ sublease.propertyName }} <br>
                  Price: ${{ sublease.subleasePrice }} <br>
                  Duration: {{ sublease.duration }} month(s) <br>
                  Description: {{ sublease.description }} <br> <!-- Added description -->
                  Lease Owner: {{ sublease.leaseOwner }} <br> <!-- Added lease owner -->
                  <span v-if="sublease.verified !== undefined">
    Verified: <span v-if="sublease.verified" style="color: #00cc00; font-weight: bold;">Yes</span>
    <span v-else style="color: #cc0000; font-weight: bold;">No</span>
  </span>
  <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font"
                  @click="verifySublease(sublease)">
            Verify
          </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="listingtext" style="width: 100%; display: flex;">
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <button class="block py-1 px-2 rounded md:bg-light-orange md:text-white text-lg font-default-font" @click="nextPage" :disabled="currentPage === pageCount">Next</button>
        <p style="margin: auto 10px auto 0px">Subleases per Page</p>
        <select @change="setPageSize($event)">
          <option value="1">1</option>
          <option value="2">2</option>
          <option selected="selected" value="3">3</option>
        </select>
      </div>
    </div>
  </template>
  
  <script>
  import router from '../router/index'
  import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore/lite'
  import { firebaseapp } from '../firebaseInit'
  import { getAuth } from 'firebase/auth'

  
  export default {
    async mounted() {
      try {
        const subleasesData = await this.getSubleases();
        if (subleasesData) {
          this.subleases = subleasesData;
        } else {
          router.push({ name: 'not-found' });
        }
      } catch (error) {
        console.error("Error fetching subleases data:", error);
      }
    },
    data() {
      return {
        subleases: [],
        sortName: 'propertyName',
        sortDir: 'asc',
        pageSize: 3,
        currentPage: 1,
        minDuration: null,
        minCost: null, // Added field for min cost
        maxCost: 10000, // Added field for max cost
      };
    },
    methods: {
        async verifySublease(sublease) {
    const db = getFirestore(firebaseapp);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const ownerUsername = sublease.ownerUsername;
    
    console.log("currentUser ", currentUser);
    console.log("ownerUsernamae", ownerUsername)
    if (currentUser && ownerUsername) {
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            const username = userDocSnap.data().username;
            console.log("currentUsername", username);
            if (username === ownerUsername) {
                console.log('Current user UID:', currentUser.uid);
                console.log('Current user Username:', username);
                console.log('Sublease Owner Username:', ownerUsername);
                console.log('Verification successful. Printing sublease information:');
                console.log('Property Name:', sublease.propertyName);
                console.log('Price:', sublease.subleasePrice);
                console.log('Duration:', sublease.duration);
                console.log('Description:', sublease.description);
                console.log('Lease Owner:', sublease.leaseOwner);
                console.log('Verified:', sublease.verified ? 'Yes' : 'No');

                const subleaseDocRef = doc(db, 'subleases', sublease.id);
                await updateDoc(subleaseDocRef, { verified: true });
                console.log('Sublease verified status updated successfully.');
                this.subleases = await this.getSubleases();
                alert('Sublease verified successfully.');

            } else {
                console.log('Current user is not authorized to verify this sublease.');

                alert('You are not authorized to verify this sublease.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    } else {
        console.log('User or ownerUsername not found.');
    }
},
      async getSubleases() {
        try {
          const db = getFirestore(firebaseapp);
          const querySnapshot = await getDocs(collection(db, 'subleases'));
  
          if (querySnapshot.empty) {
            return [];
          }
  
          const subleasesArray = [];
          querySnapshot.forEach(doc => {
            subleasesArray.push({ id: doc.id, ...doc.data() });
          });
  
          return subleasesArray;
        } catch (error) {
          console.error('Error fetching subleases data:', error);
          return [];
        }
      },
      sort(s) {
        if (s === this.sortName) {
          this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        }
        this.sortName = s;
      },
      nextPage() {
        if (this.currentPage < this.pageCount) this.currentPage++;
      },
      prevPage() {
        if (this.currentPage > 1) this.currentPage--;
      },
      setPageSize(event) {
        this.pageSize = event.target.value;
      },
    },
    computed: {
      sortedSubleases() {
        return this.subleases.sort((a, b) => {
          let modifier = 1;
          if (this.sortDir === 'desc') modifier = -1;
          if (a[this.sortName] < b[this.sortName]) return -1 * modifier;
          if (a[this.sortName] > b[this.sortName]) return 1 * modifier;
          return 0;
        });
      },
      pageCount() {
        return Math.ceil(this.filteredSubleases.length / this.pageSize);
      },
      filteredSubleases() {
      let filtered = this.sortedSubleases;

      // Apply filters only if at least one filter is set
      if (this.minDuration !== null ||
          this.minCost !== null ||
          (this.maxCost !== null && this.maxCost !== '')) {
        filtered = filtered.filter(sublease => {
          // Filter by min duration
          if (this.minDuration !== null) {
            return sublease.duration >= this.minDuration;
          }
          return true;
        }).filter(sublease => {
          // Filter by min and max cost
          if (this.minCost !== null && this.maxCost !== null && this.maxCost !== '') {
            return sublease.subleasePrice >= this.minCost && sublease.subleasePrice <= this.maxCost;
          } else if (this.minCost !== null && this.maxCost === '') {
            return sublease.subleasePrice >= this.minCost;
          } else if (this.minCost === null && this.maxCost !== '' && this.maxCost !== null) {
            return sublease.subleasePrice <= this.maxCost;
          }
          return true;
        });
      }

      return filtered;
    },
      paginatedSubleases() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        return this.filteredSubleases.slice(start, end);
      },
    },
  };
  </script>
  
  <style>
  .listingtext {
    color: black;
  }
  .propertydiv {
    width: 400px;
    height: auto;
    border: 1px solid black;
    color: black;
    padding-left: 5px;
    gap: 10px;
  }
  button {
    margin-right: 10px;
    margin-top: 5px;
  }
  .verify-btn {
  margin-top: auto; /* Pushes the button to the bottom of the box */
  margin-left: auto; /* Aligns the button to the right within the box */
  padding: 5px 10px; /* Adjusted padding for button size */
  background-color: #f0f0f0; /* Added background color for better visibility */
  border: 1px solid #ccc; /* Added border for button */
  border-radius: 5px; /* Rounded corners for button */
  cursor: pointer;
}
  </style>
  