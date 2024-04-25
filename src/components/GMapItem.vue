<script lang="ts">
  import {GoogleMap, Marker, Polyline, InfoWindow} from "vue3-google-map";
  import {defineComponent, normalizeProps, } from "vue";
  import { getFirestore, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
  import { firebaseapp } from '../firebaseInit'
  import {MapMouseEvent, LatLng, LatLngLiteral} from "google.maps";
  import {decode} from "@googlemaps/polyline-codec";
  import busRoutes from "@/assets/citybus-lafayette-in-us-json/organized_shapes.json";
  import trips from "@/assets/citybus-lafayette-in-us-json/trips.json"
  import routes from "@/assets/citybus-lafayette-in-us-json/routes.json"
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
        allBusRoutes: busRoutes, // Constant full list of routes
        busRoutes: busRoutes,    // Routes to be manipulated
        clickedPosition: null,
        routeDetails: {},
        renderRouteDetails: false,
        formattedRouteDetails: ["route_id", "route_long_name", "route_desc", "route_color"]
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
            address: data.address,
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

      let filteredProperties: Array<object> = [];
      properties.forEach(val => filteredProperties.push(Object.assign({}, val)));

      return { 
        center: { lat: 40.420781, lng: -86.918061 },
        campus,
        hotspots,
        favorites,
        properties,
        filteredProperties,
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
        if (!proximity) {
          this.filteredProperties = this.properties;
          return;
        }
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
                  this.filteredProperties.splice(index, 1);
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
        if (!proximity) {
          this.filteredProperties = this.properties;
          return;
        }
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
              this.filteredProperties.splice(index, 1);
            }

          }
          
        }

      },
      filterByHotspotLocation:function(proximity, hotspotPosition) {
        if (!proximity) {
          this.filteredProperties = this.properties;
          return;
        }
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
              this.filteredProperties.splice(index, 1);
            }

          }
          
        }

      },
      filterByZipcode:function(zipcode) {  
        if (!zipcode) {
          this.filteredProperties = this.properties;
          return;
        }

        let currentZipcode;  
        let address;  
        for (let index = this.properties.length - 1; index >= 0; index--) {
          if(this.properties[index].position != null) {
            if (this.properties[index].address) {
              address = this.properties[index].address.trim();
              currentZipcode = address.substring(address.length - 5);
            } else {
              currentZipcode = "";
            }

            if (currentZipcode != zipcode) {
              this.filteredProperties.splice(index, 1);
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


      },



      // BUS ROUTES CODE
      // Method to calculate polyline options for bus routes
      busPolylineOptions(route, shapeId) {
        // Check if route is defined and is an array
        if (!route || !Array.isArray(route)) {
          return null; // Return null if route is not valid
        }
        // console.log(shapeId)

        // Convert each coordinate pair in the route to { lat, lng } format
        const coordLatlngs = route.map(coord => ({ lat: coord.lat, lng: coord.lng }));

        // Generate a random color for the polyline
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const red = '#FF0000';
        // const color = this.routeDetails[shapeId].route_color;
        const color = (this.routeDetails && this.routeDetails[shapeId]) ? this.routeDetails[shapeId].route_color : red;
        const colorStr = "#" + color;
        // console.log(color)

        return {
          path: coordLatlngs,
          geodesic: true,
          strokeColor: colorStr,
          strokeWeight: 2
        };
      },
      filterRoutesByDistance(busRoutes, targetLat, targetLng, maxDistance) {
        const filteredRoutes = {};

        for(const routeId in busRoutes) {
          const route = busRoutes[routeId];
          let routeHasPointsWithinDistance = false;

          for (const point of route) {
            const distance = this.haversineDistanceBetweenPoints(point.lat, point.lng, targetLat, targetLng);
            if (distance <= maxDistance) {
              routeHasPointsWithinDistance = true;
              break; // No need to check other points if one is within distance
            }
          }

          if (routeHasPointsWithinDistance) {
            filteredRoutes[routeId] = route;
          }
        }

          return filteredRoutes;
      },
      onMarkerClick(position) {
        // GENERATE BUS ROUTES AROUND CLICKED POSITION
        this.clickedPosition = position;
        this.busRoutes = this.allBusRoutes;
        this.busRoutes = this.filterRoutesByDistance(this.busRoutes, this.clickedPosition.lat, this.clickedPosition.lng, .25)
        this.getAllRouteDetails();
        this.renderRouteDetails = false;
      },
      findRouteDetailsByShapeId(shapeId) {
        const trip = trips.find(trip => trip.shape_id === shapeId);
        if (trip) {
          const routeId = trip.route_id;
          return routes.find(route => route.route_id === routeId);
        }
        return null; // Return null if no matching trip found
      },
      getAllRouteDetails() {
        // Iterate through busRoutes and find route details for each shape_id
        const routeDetails = {};
        for (const shapeId in busRoutes) {
          if (busRoutes.hasOwnProperty(shapeId)) {
            const routeDetail = this.findRouteDetailsByShapeId(shapeId);
            if (routeDetail) {
              routeDetails[shapeId] = routeDetail;
            }
          }
        }
        this.routeDetails = routeDetails;
        // console.log(routeDetails)
      },
      showRouteDetails(shapeId) {
        // Access route details using shapeId
        const routeDetails = this.routeDetails[shapeId];
        this.formattedRouteDetails[0] = routeDetails.route_id;
        this.formattedRouteDetails[1] = routeDetails.route_long_name;
        this.formattedRouteDetails[2] = routeDetails.route_desc;
        this.formattedRouteDetails[3] = "#" + routeDetails.route_color;

        // Set route details and show the container
        // this.routeDetails = routeDetails ? routeDetails : "No details available";
        this.renderRouteDetails = true;
      },
      hideRouteDetails() {
        // Hide the route details container when mouseout
        this.renderRouteDetails = false;
        this.formattedRouteDetails = ["route_id", "route_long_name", "route_desc", "route_color"]
      },
      goToPropertyTable: function(propertyName){
        this.$emit("listingsTableEvent", propertyName);
      },


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

    <!-- Iterate over busRoutes keys and render polylines -->
      <template v-for="(route, shapeId) in busRoutes">
        <Polyline v-if="clickedPosition" :key="route" :options="busPolylineOptions(route, shapeId)" @mouseover="showRouteDetails(shapeId)" @mouseout="hideRouteDetails"/>
        <!-- <Polyline v-if="clickedPosition" :key="route" :options="busPolylineOptions(route, shapeId)" @click="showRouteDetails(shapeId)"/> -->
      </template>

    <Marker v-for="hotspot in hotspots" :options="hotspot" :key="hotspot.position" @click="onMarkerClick(hotspot.position)">
      <InfoWindow>
        <div class="infoWindow">
          {{ hotspot.position }} <br>
        </div>
      </InfoWindow>
    </Marker>
    <Marker v-for="favorite in favorites" :options="favorite" :key="favorite.position" @click="onMarkerClick(favorite.position)">
      <InfoWindow>
        <div class="infoWindow">
          {{ favorite.position }} <br>
        </div>
      </InfoWindow>
    </Marker>
    <Marker v-for="property in filteredProperties" :options="property" :key="property.position" @click="onMarkerClick(property.position);goToPropertyTable(property.propertyName)">
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

  <div class="route-details" v-if="renderRouteDetails">
    <p>Route ID: {{ formattedRouteDetails[0] }}</p>
    <p>Name: {{ formattedRouteDetails[1] }}</p>
    <p>Description: {{ formattedRouteDetails[2] }}</p>
    <p>Color: <span :style="{ backgroundColor: formattedRouteDetails[3], width: '20px', height: '20px', display: 'inline-block' }">&nbsp;</span></p>
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

  .route-details {
    position: absolute;
    color: black;
    bottom: 20px; /* Adjust as needed */
    left: 20px; /* Adjust as needed */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  .infoWindow {
    color: black;
  }
</style>