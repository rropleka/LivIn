<script lang="ts">
  import {GoogleMap, Marker} from "vue3-google-map";
  import {defineComponent} from "vue";

  export default defineComponent({
    // eslint-disable-next-line vue/no-reserved-component-names
    components: { GoogleMap, Marker },
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
    }
  });
</script>

<template>
  <GoogleMap api-key="AIzaSyAuAji5VLjhvBMxeLE5SMjVJA4soq1JZK8" :style=style :center="center" :zoom="15">
    
  </GoogleMap>
</template>

<style scoped>

</style>