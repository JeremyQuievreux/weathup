<template>
  <div class="app-header">
    <div class="logo-title" :class="{ 'logo-title-light': !isDark, 'logo-title-dark': isDark }">
      <MdiIcon icon="mdiCloudUpload" size="40px" />
      <h1>WeathUp</h1>
    </div>
    <div class="btn-container">
      <v-btn icon density="compact" :aria-label="isDark ? 'Activer le mode clair' : 'Activer le mode sombre'" @click="toggleTheme">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
      <v-btn icon density="compact">
        <v-icon>{{ 'mdi-web' }}</v-icon>
        <v-menu v-model="menu" activator="parent" location="bottom" offset="10">
          <v-list
            bg-color="surface-light"
            class="d-flex flex-column ga-1 pa-1"
            density="compact"
            rounded="lg"
            slim
          >
            <v-list-item
              v-for="availableLocale in locales"
              :key="availableLocale.code"
              :title="availableLocale.name"
              :active="locale === availableLocale.code"
              rounded="lg"
              link
              @click="changeLocale(availableLocale.code)"
            >
              <template #prepend>
                <span class="mr-2">
                  {{ availableLocale.flag }}
                </span>
              </template>

              <template #append>
                <v-icon
                  v-if="locale === availableLocale.code"
                  size="small"
                >
                  mdi-check
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";

import { shallowRef } from 'vue'

  const menu = shallowRef(false)

const { locales, locale, setLocale } = useI18n();
const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

function toggleTheme() {
  theme.global.name.value = isDark.value ? "light" : "dark";
}

async function changeLocale(code: string) {
  await setLocale(code);
  menu.value = false;
}
</script>
