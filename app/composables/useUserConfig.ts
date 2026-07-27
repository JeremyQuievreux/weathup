import { ref } from "vue";
import type { Airport } from "~/types/airport";

const STORAGE_KEY = "weathup";

interface UserConfig {
  darkMode: boolean;
}

interface WeathupStore {
  favoritesAirports: Airport[];
  userConfig: UserConfig;
}

const defaultStore: WeathupStore = {
  favoritesAirports: [],
  userConfig: {
    darkMode: false,
  },
};

function loadFromStorage(): WeathupStore {
  if (import.meta.client) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        favoritesAirports: parsed.favoritesAirports ?? [],
        userConfig: { ...defaultStore.userConfig, ...parsed.userConfig },
      };
    }
  }
  return structuredClone(defaultStore);
}

const store = ref<WeathupStore>(loadFromStorage());

function persist() {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.value));
  }
}

export function useUserConfig() {
  function setDarkMode(value: boolean) {
    store.value.userConfig.darkMode = value;
    persist();
  }

  function addFavoriteAirport(airport: Airport) {
    const exists = store.value.favoritesAirports.some(
      (fav) => fav.icao === airport.icao,
    );
    if (!exists) {
      store.value.favoritesAirports.push(airport);
      persist();
    }
  }

  return {
    store,
    setDarkMode,
    addFavoriteAirport,
  };
}
