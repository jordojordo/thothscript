<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import { useToolConfigStore } from '@/stores/useToolConfigStore';

import websocket from '@/services/websocket';

const toolConfigStore = useToolConfigStore();

toolConfigStore.loadFromLocalStorage();

onMounted(() => {
  websocket.connect();
});

onUnmounted(() => {
  websocket.disconnect();
});

// Watch for changes in the WebSocket config and reconnect if it changes
watch(() => toolConfigStore.websocket, () => {
  if ( toolConfigStore.shouldReconnect ) {
    websocket.disconnect();
    websocket.connect();

    toolConfigStore.setShouldReconnect(false);
  }
}, { deep: true });
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
