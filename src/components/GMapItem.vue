<script lang="ts">
  import {GoogleMap, Marker} from "vue3-google-map";
  import {defineComponent} from "vue";
  import {MapMouseEvent} from "google.maps";

  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
    data() {
      return {
        point1: {lat: 999, lng: 999},
        point2: {lat: 999, lng: 999},
        showMarker1: false,
        showMarker2: false,
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
      },
      marker1options() {
        return {
          position: this.point1,
          label: '1',
          title: "Start"
        }
      },
      marker2options() {
        return {
          position: this.point2,
          label: '2',
          title: "Destination"
        }
      }
    },
    methods: {
      onMapClick(event: MapMouseEvent) {
        this.point1 = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        this.findRoute();
      },
      onMapRightClick(event: MapMouseEvent) {
        this.point2 = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        this.findRoute();
      },
      findRoute() {
        if (this.point1.lat == 999 
         || this.point2.lat == 999) {
            return;
        }
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
    
    <Marker :options="marker1options" />
    <Marker :options="marker2options" />


  </GoogleMap>
</template>

<style scoped>

</style>