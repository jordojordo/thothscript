import { defineStore } from 'pinia';
import type { RunOpts } from '@gptscript-ai/gptscript';

let THOTHSCRIPT_API = 'localhost:3000';

if ( window && window.THOTHSCRIPT_API ) {
  THOTHSCRIPT_API = window.THOTHSCRIPT_API;
}

export interface ToolConfigState {
  maxTokens: number;
  modelName: string;
  temperature: number;
  chat: boolean;
  runOpts: RunOpts;
  websocketUrl: string;
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
      cacheDir:     '',
      quiet:        false,
      chdir:        '',
      subTool:      '',
      workspace:    '',
    },
    websocketUrl: `${ THOTHSCRIPT_API }` || 'localhost:3000'
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
    updateWebSocketUrl(url: string) {
      this.websocketUrl = url;
    }
  },
});
