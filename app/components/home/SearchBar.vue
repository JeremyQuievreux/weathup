<template>
  <div class="home-search-bar">
    <v-autocomplete
      v-model="selectedAirport"
      v-model:search="search"
      v-model:menu="isMenuOpen"
      :items="filteredAirports"
      item-title="name"
      item-value="icao"
      :label="$t('search')"
      placeholder="Name, Municipality, IATA or ICAO"
      clearable
      no-filter
      return-object
      hide-selected
      :menu-props="{ width: '0' }"
      @update:model-value="onSelectAirport"
    >
      <template #item="{ props, item }">
        <div class="search-bar-item" v-bind="props">

            <p class="icao-chip-container">{{ item.icao }}</p>

          <div class="item-content">
            <p class="item-title">{{ item.name }}</p>
            <p class="item-subtitle">
              {{ item.municipality }} · {{ item.country }} ·
              {{ getCountryFlag(item.iso) }}
            </p>
          </div>
          <div class="item-add-btn">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              class="option-add-btn"
              @click.stop.prevent="onAddAirportToFavList(item)"
            >
              <MdiIcon icon="mdiPlus" size="20px" />
            </v-btn>
          </div>
        </div>
      </template>

      <template #no-data>
        <v-list-item title="Aucun aéroport trouvé" />
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { AIRPORTS_LIST } from "../../data/airports";
import type { Airport } from "../../types/airport";

const isMenuOpen = ref(false);

interface Props {
  favAirportList: Airport[];
}

const props = withDefaults(defineProps<Props>(), {
  favAirportList: () => [],
});

const airports: Airport[] = AIRPORTS_LIST;

const search = ref("");
const selectedAirport = ref<Airport | null>(null);

const filteredAirports = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) {
    return airports;
  }

  return airports.filter((airport) =>
    [
      airport.name,
      airport.municipality,
      airport.country,
      airport.iata,
      airport.icao,
    ].some((value) => value?.toLowerCase().includes(query))
  );
});

const getCountryFlag = (isoCode: string) => {
  if (!isoCode || typeof isoCode !== "string" || isoCode.length !== 2) {
    return "";
  }
  const codeUpper = isoCode.toUpperCase();
  const firstLetter = codeUpper.charCodeAt(0) - 65 + 0x1f1e6;
  const secondLetter = codeUpper.charCodeAt(1) - 65 + 0x1f1e6;
  return String.fromCodePoint(firstLetter, secondLetter);
};

const onSelectAirport = async (airport: Airport | null) => {
  if (!airport) return;

  console.log("Aéroport sélectionné :", airport);

  // Plus tard :
  // navigateTo(`/airports/${airport.icao}`)
  // ou :
  // dialogAirport.value = airport
  // dialog.value = true

  await nextTick();

  selectedAirport.value = null;
  search.value = "";
};

const onAddAirportToFavList = (airport: Airport) => {
  const exists = props.favAirportList.some(
    (favAirport) => favAirport.icao === airport.icao
  );

  if (!exists) {
    props.favAirportList.push(airport);
  }
  isMenuOpen.value = false;
  search.value = "";
};
</script>
