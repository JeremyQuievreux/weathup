

<template>
  <div class="home-container">
    <HomeSearchBar :favAirportList="favAirportList" />
    <HomeFavList :favAirportList="favAirportList" />
  </div>
</template>

<script setup lang="ts">
import type { Airport } from "../types/airport";
import { ref } from "vue";

const favAirportList = ref<Airport[]>([
  {
    icao: "PPIT",
    iata: "NUP",
    name: "Nunapitchuk Airport",
    municipality: "Nunapitchuk",
    country: "US",
    iso: "US",
    lat: 60.905591,
    lon: -162.440454,
  },
  {
    icao: "PAKA",
    iata: "TEK",
    name: "Tatitlek Airport",
    municipality: "Tatitlek",
    country: "US",
    iso: "US",
    lat: 60.871449,
    lon: -146.690297,
  },
  {
    icao: "PACH",
    iata: "CHU",
    name: "Chuathbaluk Airport",
    municipality: "Chuathbaluk",
    country: "US",
    iso: "US",
    lat: 61.579102,
    lon: -159.216003,
  },
]);
</script>
