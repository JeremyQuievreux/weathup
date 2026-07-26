<template>
  <p v-for="(airport, index) in props.favAirportList" :key="index">{{ airport.name }} ({{ airport.icao }})</p>
</template>
<script setup lang="ts">
import type { Airport } from "../../types/airport";

interface Props {
  favAirportList: Airport[] | null;
}

const props = withDefaults(defineProps<Props>(), {
  favAirportList: () => [],
});
</script>
