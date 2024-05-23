import { reactive } from 'vue';
import mitt from 'mitt';

import { useToolConfigStore } from '@/stores/useToolConfigStore';
import type { SystemMessage, UserMessage } from '@/types/chat';

interface WebSocketState {
  isConnected: boolean;
  messages: (UserMessage | SystemMessage)[];
  reconnectAttempts: number;
}

const emitter = mitt();

const state = reactive<WebSocketState>({
  isConnected:       false,
  messages:          [],
  reconnectAttempts: 0
});

let socket: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
const maxReconnectAttempts = 10; // Limit number of attempts within 10 minutes
const reconnectInterval = 10000; // Try to reconnect every 10 seconds

const connect = (url?: string) => {
  if ( reconnectTimeout !== null ) {
    clearTimeout(reconnectTimeout);
  }

  const toolConfigStore = useToolConfigStore();

  socket = new WebSocket(`ws://${ url || toolConfigStore.websocketUrl }/ws/`);

  socket.onopen = () => {
    state.isConnected = true;
    state.reconnectAttempts = 0;
    emitGrowl('Connected', 'success');
    emitter.emit('connected');
  };

  socket.onmessage = (event: MessageEvent) => {
    const parsedMessage = JSON.parse(event.data);
    // console.log('Received message:', parsedMessage);

    handleMessage(parsedMessage);
  };

  socket.onclose = () => {
    state.isConnected = false;
    emitter.emit('disconnected');

    if ( state.reconnectAttempts < maxReconnectAttempts ) {
      emitGrowl('Disconnected. Reconnecting...', 'warning');
      state.reconnectAttempts++;
      reconnectTimeout = setTimeout(() => connect(url), reconnectInterval);
    } else {
      emitGrowl('Failed to reconnect after multiple attempts.', 'error');
    }
  };

  socket.onerror = (error: Event) => {
    console.error('WebSocket error:', error); // eslint-disable-line no-console
  };
};

const handleMessage = (systemMessage: SystemMessage) => {
  if ( systemMessage ) {
    let newMessage: SystemMessage | null = null;

    if ( systemMessage.output.event === 'Error' ) {
      newMessage = {
        id:     Date.now(),
        author: systemMessage.author || 'system',
        output: {
          event:   systemMessage.output?.event,
          message: systemMessage.output?.message,
          error:   systemMessage.output?.error
        }
      };
    } else if ( systemMessage.output.message  ) {
      const { event, message } = systemMessage.output;

      newMessage = {
        id:     Date.now(),
        author: systemMessage.author || 'system',
        output: {
          event,
          message
        }
      };
    }

    if ( systemMessage.output.event === 'CallProgress') {
      console.log('## CallProgress:', systemMessage.output.message); // eslint-disable-line no-console
    }

    if ( newMessage && !state.messages.some((msg) => 'output' in msg && msg.output.message === newMessage?.output.message) ) {
      state.messages.push(newMessage);
      emitter.emit('message', newMessage);
    }
  }
};

const send = (text: string) => {
  const toolConfigStore = useToolConfigStore();

  if ( state.isConnected && socket ) {
    const message = {
      id:         Date.now(),
      author:     'User',
      input:      text,
      toolConfig: {
        maxTokens:   toolConfigStore.maxTokens,
        modelName:   toolConfigStore.modelName,
        temperature: toolConfigStore.temperature,
        chat:        toolConfigStore.chat,
        runOpts:     toolConfigStore.runOpts
      }
    };

    state.messages.push(message);
    socket.send(JSON.stringify(message));
  }
};

const disconnect = () => {
  if ( socket && state.isConnected ) {
    socket.close();
  }
};

const emitGrowl = (message: string, type: 'success' | 'warning' | 'error') => {
  const event = new CustomEvent('growl', {
    detail: {
      message,
      type
    },
  });

  window.dispatchEvent(event);
};

export default {
  state,
  connect,
  send,
  disconnect,
  on: emitter.on,
};
