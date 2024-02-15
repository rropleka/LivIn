<script lang="ts">
  import {GoogleMap, Marker} from "vue3-google-map";
  import {defineComponent} from "vue";
  import {MapMouseEvent} from "google.maps";

  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
    data() {
      return {
        point1: null,
        point2: null,
      }
    },
    setup() {
      const center = { lat: 40.420781, lng: -86.918061 };
      return { center };
    },
    computed: {
      style() {
        const mapHeight = window.screen.height - 260;
        return {
          width: '100%',
          height: mapHeight+'px',
        }
      }
    },
    methods: {
      onMapClick(event: MapMouseEvent) {
        this.point1 = event.latLng.lat();
        console.log(this.point1);
        console.log(this.point2);
      },
      onMapRightClick(event) {
        this.point2 = event.latLng.lat();
        console.log(this.point1);
        console.log(this.point2);
      }
    }
  });
</script>

<template>
  <GoogleMap 
    api-key="AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8" 
    :style=style 
    :center="center" 
    @click="onMapClick"
    @contextmenu="onMapRightClick"
    :zoom="15">
    
  </GoogleMap>
</template>

<style scoped>

</style>