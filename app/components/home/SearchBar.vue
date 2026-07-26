<template>
  <div class="home-search-bar">
    <v-autocomplete v-model="selectedAirport" v-model:search="search" :items="filteredAirports" item-title="name" item-value="icao" :label="$t('search')" placeholder="Name, Municipality, IATA or ICAO" clearable no-filter return-object hide-selected @update:model-value="onSelectAirport">
      <template #item="{ props, item }">
        <v-list-item v-bind="props" :title="item.name" :subtitle="`${item.municipality} · ${item.country} · ${getCountryFlag(item.iso)}`">
          <template v-slot:prepend>
            <div class="text-right mr-4" style="width: 50px;">
              <div class="text-caption text-medium-emphasis icao-chip">{{ item.icao }}</div>
            </div>
          </template>
          <template v-slot:append>
            <v-icon-btn @click="onAddAirportToFavList(item)"  class="option-add-btn">
              <MdiIcon icon="mdiPlus" size="20px" />
            </v-icon-btn>
          </template>
        </v-list-item>
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
const { locale } = useI18n();

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
};
</script>
