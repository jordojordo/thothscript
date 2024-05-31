import { defineStore } from 'pinia';
import type { RunOpts } from '@gptscript-ai/gptscript';

import { getWebsocketConfig } from '@/utils/service';
import type { WebsocketConfig } from '@/types/chat';

const LOCAL_STORAGE_KEY = 'toolConfig';

export interface ToolConfigState {
  maxTokens: number;
  modelName: string;
  temperature: number;
  chat: boolean;
  runOpts: RunOpts;
  websocket: WebsocketConfig;
  shouldReconnect: boolean;
}

export const useToolConfigStore = defineStore('toolConfig', {
  state: (): ToolConfigState => ({
    maxTokens:   1000,
    modelName:   'gpt-4o',
    temperature: 0.7,
    chat:        true,
    runOpts:     {
      input:        '',
      disableCache: false,
      quiet:        false,
      chdir:        '',
      subTool:      '',
      workspace:    '',
    },
    websocket: {
      ...getWebsocketConfig(),
      keepAliveInterval: 120,
    },
    shouldReconnect: false,
  }),
  actions: {
    updateMaxTokens(maxTokens: number) {
      this.maxTokens = maxTokens;
    },
    updateModelName(modelName: string) {
      this.modelName = modelName;
    },
    updateTemperature(temperature: number) {
      this.temperature = temperature;
    },
    updateChat(chat: boolean) {
      this.chat = chat;
    },
    updateRunOpts(runOpts: RunOpts) {
      this.runOpts = runOpts;
    },
    updateWebSocketConfig(config: WebsocketConfig) {
      this.websocket = config;
    },
    setShouldReconnect(value: boolean) {
      this.shouldReconnect = value;
    },
    saveToLocalStorage() {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state));
    },
    loadFromLocalStorage() {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);

      if ( storedState ) {
        this.$patch(JSON.parse(storedState));
      }
    },
  },
});
