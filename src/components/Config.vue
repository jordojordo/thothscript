<script setup lang="ts">
import { ref, reactive } from 'vue';

import { useToolConfigStore } from '@/stores/useToolConfigStore';

const toolConfigStore = useToolConfigStore();

const localConfig = reactive({
  websocket: {
    host: toolConfigStore.websocket.host,
    port: toolConfigStore.websocket.port,
    keepAliveInterval: toolConfigStore.websocket.keepAliveInterval,
  },
  modelName: toolConfigStore.modelName,
  maxTokens: toolConfigStore.maxTokens,
  temperature: toolConfigStore.temperature,
  chat: toolConfigStore.chat,
  runOpts: {
    disableCache: toolConfigStore.runOpts.disableCache,
    quiet: toolConfigStore.runOpts.quiet,
    workspace: toolConfigStore.runOpts.workspace,
  },
});

const saveButton = ref('Save');

const saveConfig = () => {
  toolConfigStore.websocket.host = localConfig.websocket.host;
  toolConfigStore.websocket.port = localConfig.websocket.port;
  toolConfigStore.websocket.keepAliveInterval = localConfig.websocket.keepAliveInterval;
  toolConfigStore.modelName = localConfig.modelName;
  toolConfigStore.maxTokens = localConfig.maxTokens;
  toolConfigStore.temperature = localConfig.temperature;
  toolConfigStore.chat = localConfig.chat;
  toolConfigStore.runOpts.disableCache = localConfig.runOpts.disableCache;
  toolConfigStore.runOpts.quiet = localConfig.runOpts.quiet;
  toolConfigStore.runOpts.workspace = localConfig.runOpts.workspace;

  toolConfigStore.setShouldReconnect(true);
  toolConfigStore.saveToLocalStorage();

  saveButton.value = 'Saved!';

  setTimeout(() => {
    saveButton.value = 'Save';
  }, 3000);
};
</script>


<template>
  <section class="chat-config">
    <h2>Settings</h2>
    <form @submit.prevent="saveConfig">
      <fieldset>
        <legend>Connection</legend>
        <div>
          <label>Host</label>
          <input v-model="localConfig.websocket.host" type="text" />
        </div>
        <div>
          <label>Port</label>
          <input v-model="localConfig.websocket.port" type="text" />
        </div>
        <div>
          <label>Keep-Alive Interval (seconds)</label>
          <input v-model.number="localConfig.websocket.keepAliveInterval" type="number" />
        </div>
      </fieldset>
      <fieldset>
        <legend>Model Configuration</legend>
        <div>
          <label>Model Name</label>
          <input v-model="localConfig.modelName" type="text" />
        </div>
        <div>
          <label>Max Tokens</label>
          <input v-model.number="localConfig.maxTokens" type="number" />
        </div>
        <div>
          <label>Temperature</label>
          <input v-model.number="localConfig.temperature" type="number" step="0.1" />
        </div>
      </fieldset>
      <fieldset>
        <legend>Options</legend>
        <div class="option">
          <label>Chat</label>
          <input v-model="localConfig.chat" type="checkbox" />
        </div>
        <div class="option">
          <label>Disable Cache</label>
          <input v-model="localConfig.runOpts.disableCache" type="checkbox" />
        </div>
        <div class="option">
          <label>Quiet</label>
          <input v-model="localConfig.runOpts.quiet" type="checkbox" />
        </div>
      </fieldset>
      <fieldset>
        <legend>Workspace</legend>
        <div>
          <label>Workspace</label>
          <input v-model="localConfig.runOpts.workspace" type="text" />
        </div>
      </fieldset>
      <div class="save-container">
        <button type="submit" class="save-button">{{ saveButton }}</button>
      </div>
    </form>
  </section>
</template>


<style scoped>
.chat-config {
  display: flex;
  flex-direction: column;
  height: auto;
  max-width: 725px;
  margin: 0 auto;
  border: 0;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  padding: 2rem;
  background-color: var(--background-tertiary);
}

.chat-config h2 {
  margin-top: 0;
  color: var(--foreground-primary);
}

.chat-config form fieldset {
  border: none;
  margin-bottom: 1.5rem;
}

.chat-config form fieldset legend {
  font-size: 1.2rem;
  color: var(--foreground-highlight);
  margin-bottom: 0.5rem;
}

.chat-config form div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chat-config form label {
  color: var(--foreground-primary);
}

.chat-config form input[type="text"],
.chat-config form input[type="number"],
.chat-config form input[type="checkbox"] {
  border: 1px solid var(--foreground-tertiary);
  border-radius: 4px;
  padding: 4px;
  background-color: var(--white);
  color: var(--black);
}

.option {
  display: flex;
  align-items: center;
}

.option input {
  margin-left: 0.5rem;
}

.save-container {
  display: flex;
  align-items: center;
  width: 40%;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--foreground-button);
  color: var(--pink-light);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
}

@media (max-width: 725px) {
  .chat-config {
    border: 0;
    border-radius: 0;
  }
}

@media (max-width: 450px) {
  .chat-config form div {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
