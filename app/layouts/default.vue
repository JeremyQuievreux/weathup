<template>
  <div class="app-layout">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useTheme } from "vuetify";
import { useUserConfig } from "../composables/useUserConfig";

const theme = useTheme();
const { store } = useUserConfig();

watch(
  () => store.value.userConfig.darkMode,
  (isDark) => {
    theme.global.name.value = isDark ? "dark" : "light";
  },
  { immediate: true },
);
</script>
