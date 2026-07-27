<template>
  <div class="app-layout">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "vuetify";
import { useUserConfig } from "../composables/useUserConfig";

const theme = useTheme();
const { store } = useUserConfig();

onMounted(() => {
  theme.global.name.value = store.value.userConfig.darkMode ? "dark" : "light";
});
</script>
