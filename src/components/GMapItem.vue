<script lang="ts">
  import {GoogleMap, Marker, Polyline, InfoWindow} from "vue3-google-map";
  import {defineComponent, normalizeProps} from "vue";
  import { getFirestore, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
  import { firebaseapp } from '../firebaseInit'
  import {MapMouseEvent, LatLng} from "google.maps";
  import {decode} from "@googlemaps/polyline-codec";
  import { useStore } from "vuex";
  import axios from "axios";
  

  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker, Polyline, InfoWindow},
    data() {
      return {
        point1: null,
        point2: null,
        showMarker1: false,
        showMarker2: false,
        currentPoint: {lat: 100, lng: 100},
        showCurrentMarker: false,
        polylineString: "",
        renderPolyline: false,
        formattedTravelTimes: [0, 0, 0], //driving, walking, biking
        renderTravelTimes: false,
      }
    },
    async setup() {

      const db = getFirestore(firebaseapp)

      const store = useStore();
      let currentUser = ""
        if (store.getters.currentUser) {
            currentUser = store.getters.currentUser.email;
        }

      const campus = "West Lafayette"; //placeholder
      const hotspotsSnapshot = await getDocs(query(collection(db, 'hotspots'), where('campus', '==', campus)));
      let hotspots: Array<object> = [];
      hotspotsSnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          const coords = JSON.parse(data.coords);
          hotspots.push({
            position: coords,
            icon: {
              strokeColor: "orange",
              strokeWeight: 2.5,
              fill: "orange",
              path: "M12.8324 21.8013C15.9583 21.1747 20 18.926 20 13.1112C20 7.8196 16.1267 4.29593 13.3415 2.67685C12.7235 2.31757 12 2.79006 12 3.50492V5.3334C12 6.77526 11.3938 9.40711 9.70932 10.5018C8.84932 11.0607 7.92052 10.2242 7.816 9.20388L7.73017 8.36604C7.6304 7.39203 6.63841 6.80075 5.85996 7.3946C4.46147 8.46144 3 10.3296 3 13.1112C3 20.2223 8.28889 22.0001 10.9333 22.0001C11.0871 22.0001 11.2488 21.9955 11.4171 21.9858C10.1113 21.8742 8 21.064 8 18.4442C8 16.3949 9.49507 15.0085 10.631 14.3346C10.9365 14.1533 11.2941 14.3887 11.2941 14.7439V15.3331C11.2941 15.784 11.4685 16.4889 11.8836 16.9714C12.3534 17.5174 13.0429 16.9454 13.0985 16.2273C13.1161 16.0008 13.3439 15.8564 13.5401 15.9711C14.1814 16.3459 15 17.1465 15 18.4442C15 20.4922 13.871 21.4343 12.8324 21.8013Z"
              //source: https://www.svgrepo.com/svg/525884/fire
            }
          });
        } catch (error) {
          console.log("Misformatted hotspot, skipping");
        }
      })

      const favoritesSnapshot = await getDocs(query(collection(db, 'favorites'), where('user', '==', currentUser)));
      let favorites: Array<object> = [];
      favoritesSnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          const coords = JSON.parse(data.coords);
          favorites.push({
            position: coords,
          });
        } catch (error) {
          console.log("Misformatted favorite, skipping");
        }
      })

      const propertiesSnapshot = await getDocs(query(collection(db, 'properties')));
      let properties: Array<object> = [];
      propertiesSnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          const coords = JSON.parse(data.location);
          properties.push({
            position: coords,
            propertyName: data.propertyName, 
            icon: {
              strokeColor: "green",
              strokeWeight: 2.5,
              anchor: { x: 1, y: 1 },
              scale: .15,
              fill: "green",
              path: "M41.733 160.134v-59.2H21.999L96 31.865l74 69.067h-19.733v59.201H110.8v-44.4H81.2v44.4z" 
              //source: https://www.svgrepo.com/svg/504469/house
            }
          });
        } catch (error) {
          console.log("Misformatted property, skipping");
        }
      })

      return { 
        center: { lat: 40.420781, lng: -86.918061 },
        campus,
        hotspots,
        favorites,
        properties,
       };
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
      currentMarkerOptions() {
        return {
          position: this.currentPoint,
          label: 'C',
          title: "Current Location"
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
        this.point1 = event.latLng;
        this.findRoute()
      },
      onMapRightClick(event: MapMouseEvent) {
        this.point2 = event.latLng;
        this.findRoute();
      },
      getPosition:function() {
        
      },
      filterByCurrentLocation:function(proximity) {
        let latitude;
        let longitude;
        const success = (position) => {
            latitude  = position.coords.latitude;
            longitude = position.coords.longitude;
            //create current location marker
            this.currentPoint = { lat: latitude, lng: longitude };

            console.log(this.currentPoint);
            console.log("Lat: " + latitude);
            console.log("Long: " + longitude);
            let propertyLat;
            let propertyLong;
            let distance;
            
            //for each property compute distance bewteen property and current location and filter out if not in proximity
            for (let index = this.properties.length - 1; index >= 0; index--) {
              if(this.properties[index].position != null) {
                console.log(this.properties[index].position);
                propertyLat = this.properties[index].position.lat;
                propertyLong = this.properties[index].position.lng;

                distance = this.haversineDistanceBetweenPoints(latitude,longitude,propertyLat,propertyLong);
                console.log("Distance: " + distance);
                if (distance >= proximity) {
                  this.properties.splice(index, 1);
                }

              }
              
            }
            
        };
        const error = (err) => {
            console.log("Current Location Error");
        };
        //get current location coordiantes run code in success if user allows current location access
        navigator.geolocation.getCurrentPosition(success, error);
      },
      filterByFavoriteLocation:function(proximity, favoritePosition) {
        let latitude;
        let longitude;
        console.log(favoritePosition);
        let commaIndex;
        let longIndex;
        commaIndex = favoritePosition.indexOf(",");
        longIndex = favoritePosition.indexOf("lng");
        latitude  = parseFloat(favoritePosition.substring(9, commaIndex));
        longitude = parseFloat(favoritePosition.substring(longIndex + 5, favoritePosition.length - 1));
        console.log("Lat: " + latitude);
        console.log("Long: " + longitude);
        let propertyLat;
        let propertyLong;
        let distance;
        
        for (let index = this.properties.length - 1; index >= 0; index--) {
          if(this.properties[index].position != null) {
            console.log(this.properties[index].position);
            propertyLat = this.properties[index].position.lat;
            propertyLong = this.properties[index].position.lng;

            distance = this.haversineDistanceBetweenPoints(latitude,longitude,propertyLat,propertyLong);
            console.log("Distance: " + distance);
            if (distance >= proximity) {
              this.properties.splice(index, 1);
            }

          }
          
        }

      },
      filterByHotspotLocation:function(proximity, hotspotPosition) {
        let latitude;
        let longitude;
        console.log(hotspotPosition);
        let commaIndex;
        let longIndex;
        commaIndex = hotspotPosition.indexOf(",");
        longIndex = hotspotPosition.indexOf("lng");
        latitude  = parseFloat(hotspotPosition.substring(9, commaIndex));
        longitude = parseFloat(hotspotPosition.substring(longIndex + 5, hotspotPosition.length - 1));
        console.log("Lat: " + latitude);
        console.log("Long: " + longitude);
        let propertyLat;
        let propertyLong;
        let distance;
        
        for (let index = this.properties.length - 1; index >= 0; index--) {
          if(this.properties[index].position != null) {
            console.log(this.properties[index].position);
            propertyLat = this.properties[index].position.lat;
            propertyLong = this.properties[index].position.lng;

            distance = this.haversineDistanceBetweenPoints(latitude,longitude,propertyLat,propertyLong);
            console.log("Distance: " + distance);
            if (distance >= proximity) {
              this.properties.splice(index, 1);
            }

          }
          
        }

      },
      //function obtained from https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
      //calculates distance in km between two coordinates
       haversineDistanceBetweenPoints: function(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const p1 = lat1 * Math.PI/180;
        const p2 = lat2 * Math.PI/180;
        const deltaLon = lon2 - lon1;
        const deltaLambda = (deltaLon * Math.PI) / 180;
        const d = Math.acos(
          Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda),
        ) * R;
        return d;
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

    <Marker v-for="hotspot in hotspots" :options="hotspot" :key="hotspot.position">
      <InfoWindow>
        <div class="infoWindow">
          {{ hotspot.position }} <br>
        </div>
      </InfoWindow>
    </Marker>
    <Marker v-for="favorite in favorites" :options="favorite" :key="favorite.position">
      <InfoWindow>
        <div class="infoWindow">
          {{ favorite.position }} <br>
        </div>
      </InfoWindow>
    </Marker>
    <Marker v-for="property in properties" :options="property" :key="property.position">
      <InfoWindow>
        <div class="infoWindow">
          Property Name: {{ property.propertyName }} <br>
        </div>
      </InfoWindow>
    </Marker>

    
    <Marker :options="marker1options" />
    <Marker :options="marker2options" />
    <Marker :options="currentMarkerOptions" />
    <Polyline v-if="renderPolyline" :options="polylineOptions"/>

  </GoogleMap>
  <div class="traveltimes" v-if="renderTravelTimes">
    <p>Driving Time: {{ formattedTravelTimes[0] }} minutes</p>
    <p>Walking Time: {{ formattedTravelTimes[1] }} minutes</p>
    <p>Biking Time: {{ formattedTravelTimes[2] }} minutes</p>
  </div>

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
  .infoWindow {
    color: black;
  }
</style>