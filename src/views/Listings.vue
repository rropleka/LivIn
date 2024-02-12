<script>
    //import Listing.js from "/objects/Listing.js";
    //Listing1 = new Listing('Property1');
    import router from '../router/index'
    export default {
  setup(){
    const listings = [
            { propertyName: 'Lafayette', address: '100 Lafayette Way', price: '$100' },
            { propertyName: 'Wiley Hall', address: '200 Wiley St', price: '$200' },
            { propertyName: 'Cedarwood', address: '300 Grant St', price: '$300' },
        ]
    return{listings}
    },
}
</script>

<template>
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