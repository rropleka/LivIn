<script lang="ts">
  import {GoogleMap, Marker, Polyline} from "vue3-google-map";
  import {defineComponent} from "vue";
  import {MapMouseEvent} from "google.maps";
  import axios from "axios";

  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker, Polyline },
    data() {
      return {
        point1: null,
        point2: null,
        showMarker1: false,
        showMarker2: false,
        polylineString: "",
        renderPolyline: false,
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
      },
      polylineOptions() {
        return {
          path: google.maps.geometry.encoding.decodePath(this.polylineString),
          geodesic: true,
          strokeColor: '#e8871b',
          strokeWeight: 2
        }
      }
    },
    methods: {
      onMapClick(event: MapMouseEvent) {
        this.point1 = event.latLng;
        this.findRoute()
      },
      onMapRightClick(event: MapMouseEvent) {
        this.point2 = event.latLng;
        this.findRoute();
      },
      findRoute() {

        if (this.point1 == null || this.point2 == null){
            return;
        }

        axios( {
          url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8',
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
          },
          data: {
            "origin": {
              "location": {
                //"latLng": this.point1
                "latLng": { latitude: this.point1.lat(), longitude: this.point1.lng()}
                //"latLng": { latitude: 40.420781, longitude: -86.918061 }
              }
            },
            "destination": {
              "location": {
                //"latLng": this.point2
                //"latLng": { latitude: this.point2.lat, longitude: this.point2.lng}
                //"latLng": { latitude: 41.420781, longitude: -87.918061 }
                "latLng": { latitude: this.point2.lat(), longitude: this.point2.lng()}


              }
            },
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE",
            "languageCode": "en-US",
            "units": "IMPERIAL"
          }
        }).then((response) => {
          console.log(response.data.routes[0].polyline.encodedPolyline)
          this.polylineString = response.data.routes[0].polyline.encodedPolyline;
          this.renderPolyline = true
        }).catch((error) => {
          console.log(error);
        })
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
    <Polyline v-if="renderPolyline" :options="polylineOptions"/>

  </GoogleMap>
</template>

<style scoped>

</style>