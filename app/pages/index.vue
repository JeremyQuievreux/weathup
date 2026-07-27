<template>
  <div class="home-container">
    <HomeSearchBar @add-to-favorites="addFavoriteAirport" />
    <HomeFavList :favorites="favoritesAirports" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserConfig } from "../composables/useUserConfig";

const { store, addFavoriteAirport } = useUserConfig();

const favoritesAirports = computed(() => store.value.favoritesAirports);
</script>
