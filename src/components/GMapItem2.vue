<script lang="ts">
  import {GoogleMap, Marker, Polyline} from "vue3-google-map";
  import {defineComponent, ref} from "vue";
  import {MapMouseEvent} from "google.maps";
  import {decode} from "@googlemaps/polyline-codec";
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
        formattedTravelTimes: [0, 0, 0], //driving, walking, biking
        renderTravelTimes: false,
      }
    },
    setup() {
  const center = { lat: 40.420781, lng: -86.918061 };
  const location = ref('');

//   const onMapClick = (event: MapMouseEvent) => {
//     const clickedLocation = event.latLng;
//     location.value = `${clickedLocation.lat()}, ${clickedLocation.lng()}`;
//   };

  return { center, location };
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
        let coordArrays = decode(this.polylineString);
        let coordLatlngs: Array<any> = [];

        coordArrays.forEach(item =>
        {
          coordLatlngs.push({lat: item[0], lng: item[1]});
        })

        return {
          path: coordLatlngs,
          geodesic: true,
          strokeColor: '#e8871b',
          strokeWeight: 2
        }
      },
    },
    methods: {
      onMapClick(event: MapMouseEvent) {
        this.location = event.latLng;
        this.point1 = event.latLng;
        this.findRoute()
      },
      onMapRightClick(event: MapMouseEvent) {
        this.point2 = event.latLng;
        this.findRoute();
      },
      async findRoute() {

        if (this.point1 == null || this.point2 == null){
            return;
        }

        let travelTimes = ["", "", ""];
        this.renderTravelTimes = false;

        await axios( {
          url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8',
            'X-Goog-FieldMask': 'routes.duration,routes.polyline.encodedPolyline',
          },
          data: {
            "origin": {
              "location": {
                "latLng": { latitude: this.point1.lat(), longitude: this.point1.lng()}
              }
            },
            "destination": {
              "location": {
                "latLng": { latitude: this.point2.lat(), longitude: this.point2.lng()}
              }
            },
            "travelMode": "DRIVE",
          }
        }).then((response) => {
          this.polylineString = response.data.routes[0].polyline.encodedPolyline;
          this.renderPolyline = true
          travelTimes[0] = response.data.routes[0].duration;
          console.log("travelTimes[0]: " + travelTimes[0]);
        }).catch((error) => {
          console.log(error);
        })


        await axios( {
          url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8',
            'X-Goog-FieldMask': 'routes.duration',
          },
          data: {
            "origin": {
              "location": {
                "latLng": { latitude: this.point1.lat(), longitude: this.point1.lng()}
              }
            },
            "destination": {
              "location": {
                "latLng": { latitude: this.point2.lat(), longitude: this.point2.lng()}
              }
            },
            "travelMode": "WALK",
          }
        }).then((response) => {
          travelTimes[1] = response.data.routes[0].duration;
        }).catch((error) => {
          console.log(error);
        })

        await axios( {
          url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8',
            'X-Goog-FieldMask': 'routes.duration',
          },
          data: {
            "origin": {
              "location": {
                "latLng": { latitude: this.point1.lat(), longitude: this.point1.lng()}
              }
            },
            "destination": {
              "location": {
                "latLng": { latitude: this.point2.lat(), longitude: this.point2.lng()}
              }
            },
            "travelMode": "BICYCLE",
          }
        }).then((response) => {
          travelTimes[2] = response.data.routes[0].duration;
          this.renderTravelTimes = true;
        }).catch((error) => {
          console.log(error);
        })

        console.log(travelTimes);
        //format travelTimes
        this.formattedTravelTimes = [];
        for (let i = 0; i < 3; i++) {
          let item = travelTimes[i];
          console.log("in loop");
          console.log(item);
          let timeInSeconds: number = +(item.substring(0, item.length - 1));
          console.log(timeInSeconds);
          this.formattedTravelTimes.push(Math.floor((timeInSeconds / 60) + .5));
        }
        console.log(this.formattedTravelTimes);


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

  <input type="text" v-model="location" placeholder="Click on the map to set location" style="color: black;">

</template>

<style scoped>
  .traveltimes {
    position: absolute;
    color: black;
    top: 70px;
    right: 0px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .black-text {
    color: black;
  }
</style>