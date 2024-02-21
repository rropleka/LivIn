<script lang="ts">
  import {GoogleMap, Marker} from "vue3-google-map";
  import {defineComponent, normalizeProps} from "vue";
import { getFirestore, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../firebaseInit'

  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
    async setup() {

      const db = getFirestore(firebaseapp)
      const campus = "West Lafayette"; //placeholder
      const hotspotsSnapshot = await getDocs(query(collection(db, 'hotspots'), where('campus', '==', campus)));
      let hotspots: Array<object> = [];
      hotspotsSnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          const coords = JSON.parse(data.coords);
          hotspots.push({
            position: coords,

          });
        } catch (error) {
          console.log("Misformatted hotspot, skipping");
        }

      })

      console.log(hotspots);

      return { 
        center: { lat: 40.4259, lng: -86.9081 },
        campus,
        hotspots,
       };
    },
  });
</script>

<template>
  <GoogleMap api-key="AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8" style="width: 100%; height: 565px" :center="center" :zoom="15">
    <div class="hotspotMarker" v-for="hotspot in hotspots" :key="hotspot.position">
      <Marker :options="hotspot"/>
    </div>
  </GoogleMap>
</template>

<style scoped>
  GoogleMap {
    width: 100%;
    height: 500px;
  }
</style>