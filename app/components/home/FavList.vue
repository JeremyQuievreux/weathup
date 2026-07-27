<template>
  <p v-if="!props.favorites || props.favorites.length === 0">
    No favorite airports.
  </p>
  <ul v-else>
    <li v-for="airport in props.favorites" :key="airport.icao">
      {{ airport.name }} ({{ airport.icao }})
    </li>
  </ul>
</template>
<script setup lang="ts">
import type { Airport } from "../../types/airport";

interface Props {
  favorites: Airport[] | null;
}

const props = withDefaults(defineProps<Props>(), {
  favorites: () => [],
});
</script>
