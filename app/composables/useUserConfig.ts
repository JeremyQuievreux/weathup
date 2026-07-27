import type { Airport } from "~/types/airport";

const STORAGE_KEY = "weathup";
const COOKIE_KEY = "weathup_store";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
let hasSyncedFromStorage = false;

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

function sanitizeStore(parsed: unknown): WeathupStore {
  if (!parsed || typeof parsed !== "object") {
    return structuredClone(defaultStore);
  }

  const record = parsed as Partial<WeathupStore>;

  return {
    favoritesAirports: Array.isArray(record.favoritesAirports)
      ? record.favoritesAirports
      : [],
    userConfig: { ...defaultStore.userConfig, ...(record.userConfig ?? {}) },
  };
}

function parseStore(raw: string | null | undefined): WeathupStore {
  if (!raw) {
    return structuredClone(defaultStore);
  }

  try {
    return sanitizeStore(JSON.parse(raw));
  } catch {
    return structuredClone(defaultStore);
  }
}

function isStoreEmpty(store: WeathupStore): boolean {
  return (
    store.favoritesAirports.length === 0 &&
    store.userConfig.darkMode === defaultStore.userConfig.darkMode
  );
}

export function useUserConfig() {
  const store = useState<WeathupStore>("weathup-store", () => {
    const cookie = useCookie<string | null>(COOKIE_KEY, {
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });

    if (import.meta.client) {
      const fromStorage = parseStore(localStorage.getItem(STORAGE_KEY));
      const hasStorageData =
        fromStorage.favoritesAirports.length > 0 || fromStorage.userConfig.darkMode;

      if (hasStorageData) {
        cookie.value = JSON.stringify(fromStorage);
        return fromStorage;
      }
    }

    return parseStore(cookie.value);
  });

  function persist() {
    const serialized = JSON.stringify(store.value);

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, serialized);
    }

    const cookie = useCookie<string | null>(COOKIE_KEY, {
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    cookie.value = serialized;
  }

  if (import.meta.client && !hasSyncedFromStorage) {
    const fromStorage = parseStore(localStorage.getItem(STORAGE_KEY));

    if (!isStoreEmpty(fromStorage) && isStoreEmpty(store.value)) {
      store.value = fromStorage;
      persist();
    }

    hasSyncedFromStorage = true;
  }

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
