<script lang="ts">
  import {GoogleMap, Marker} from "vue3-google-map";
  import {defineComponent} from "vue";

  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
    setup() {
      const center = { lat: 40.4259, lng: -86.9081 };
      return { center };
    },
  });
</script>

<template>
  <GoogleMap api-key="AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8" style="width: 100%; height: 565px" :center="center" :zoom="15">
    
  </GoogleMap>
</template>

<style scoped>
  GoogleMap {
    width: 100%;
    height: 500px;
  }
</style>