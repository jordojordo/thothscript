<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useToolConfigStore } from '@/stores/useToolConfigStore';

import websocket from '@/services/websocket';

const toolConfigStore = useToolConfigStore();

onMounted(() => {
  websocket.connect(toolConfigStore.websocketUrl);
});

onUnmounted(() => {
  websocket.disconnect();
});

// Watch for changes in the WebSocket URL and reconnect if it changes
watch(() => toolConfigStore.websocketUrl, (newUrl, oldUrl) => {
  if ( newUrl !== oldUrl ) {
    websocket.disconnect();
    websocket.connect(newUrl);
  }
});
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  font-family: 'OpenSans', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--foreground-primary);
  background-color: var(--background-primary);
}
</style>
