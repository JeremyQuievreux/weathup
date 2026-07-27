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
      :placeholder="$t('search_placeholder')"
      clearable
      no-filter
      return-object
      hide-selected
      :menu-props="{ width: '0', maxHeight: '250px' }"
      @update:model-value="onSelectAirport"
    >
      <template #item="{ props, item }">
        <div class="search-bar-item" v-bind="props">
          <p class="icao-chip-container">{{ item.icao }}</p>

          <div class="item-content">
            <p class="item-title">{{ item.name }}</p>
            <p class="item-subtitle">
              {{ item.municipality }} · {{ item.country }} ·
              <span v-if="item.iso" class="country-flag" :title="item.country">
                <img
                  :src="getCountryFlagUrl(item.iso)"
                  :alt="`Drapeau ${item.country}`"
                  loading="lazy"
                  decoding="async"
                />
              </span>
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
        <v-divider class="item-divider" />
      </template>

      <template #no-data>
        <v-list-item :title="$t('no_results')" />
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

// Fonction utilitaire pour nettoyer les accents et caractères spéciaux
const normalizeText = (text: String) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués (ex: 'ā' -> 'a' + accent)
    .replace(/[\u0300-\u036f]/g, ""); // Supprime les marques d'accents
};

const filteredAirports = computed(() => {
  const rawQuery = search.value.trim();

  // 1. Déclenchement à partir de 3 caractères
  if (rawQuery.length < 3) {
    return [];
  }

  // Normalisation de la saisie utilisateur (ex: "Liepā" devient "liepa")
  const query = normalizeText(rawQuery);

  const results = [];

  for (const airport of airports) {
    // Normalisation de chaque champ de l'aéroport
    const iata = normalizeText(airport.iata);
    const icao = normalizeText(airport.icao);
    const name = normalizeText(airport.name);
    const municipality = normalizeText(airport.municipality);
    const country = normalizeText(airport.country);

    let score = 0;

    // --- RÈGLES DE PRIORITÉ ---
    if (iata === query) score += 100;
    else if (icao === query) score += 90;
    else if (iata.startsWith(query)) score += 80;
    else if (icao.startsWith(query)) score += 70;
    else if (municipality.startsWith(query)) score += 50;
    else if (name.startsWith(query)) score += 40;
    else if (municipality.includes(query)) score += 30;
    else if (name.includes(query)) score += 20;
    else if (country.includes(query)) score += 10;

    if (score > 0) {
      results.push({ airport, score });
    }
  }

  // Tri par score décroissant
  return results.sort((a, b) => b.score - a.score).map((item) => item.airport);
});

const getCountryFlagUrl = (isoCode: string) => {
  if (!isoCode || typeof isoCode !== "string") {
    return "";
  }

  const code = isoCode.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) {
    return "";
  }

  return `https://flagcdn.com/24x18/${code}.png`;
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
    (favAirport) => favAirport.icao === airport.icao,
  );

  if (!exists) {
    props.favAirportList.push(airport);
  }
  isMenuOpen.value = false;
  search.value = "";
};
</script>
