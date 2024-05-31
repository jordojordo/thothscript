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
let keepAliveInterval: number | null = null;

const maxReconnectAttempts = 10; // Limit number of attempts within 10 minutes
const reconnectInterval = 10000; // Try to reconnect every 10 seconds

const connect = () => {
  if ( reconnectTimeout !== null ) {
    clearTimeout(reconnectTimeout);
  }

  const toolConfigStore = useToolConfigStore();

  const KEEP_ALIVE_INTERVAL = ( toolConfigStore.websocket.keepAliveInterval || 120 ) * 1000;
  const {
    secure, host, port, path
  } = toolConfigStore.websocket;

  const scheme = secure ? 'wss' : 'ws';
  const hostStr = host ? host : window.location.hostname;
  const portStr = port ? `:${ port }` : '';
  const pathStr = path ? path : '/ws/';
  const websocketUrl = `${ scheme }://${ hostStr }${ portStr }${ pathStr }`;

  // console.log(`Connecting to WebSocket: ${websocketUrl}`);
  socket = new WebSocket(websocketUrl);

  socket.onopen = () => {
    state.isConnected = true;
    state.reconnectAttempts = 0;
    emitGrowl('Connected', 'success');
    emitter.emit('connected');
    console.log('WebSocket connected to:', websocketUrl); // eslint-disable-line no-console

    // Start keep-alive interval
    keepAliveInterval = window.setInterval(() => {
      if ( socket && socket.readyState === WebSocket.OPEN ) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, KEEP_ALIVE_INTERVAL);
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
      reconnectTimeout = setTimeout(() => connect(), reconnectInterval);
    } else {
      emitGrowl('Failed to reconnect after multiple attempts.', 'error');
    }

    if ( keepAliveInterval ) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  };

  socket.onerror = (error: Event) => {
    console.error('WebSocket error:', error); // eslint-disable-line no-console
  };
};

const handleMessage = (systemMessage: SystemMessage) => {
  if ( systemMessage ) {
    console.log('## handleMessage:', systemMessage);
    let newMessage: SystemMessage | null = null;

    if ( systemMessage.type === 'pong' ) {
      console.log('## PONG:', systemMessage);

      return;
    }

    if ( systemMessage.output.event === 'Error' ) {
      console.log('## ERROR:', systemMessage);

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
      console.log('## MESSAGE:', systemMessage.output.message);
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

    if (
      newMessage &&
      !state.messages.some(
        (msg) => (
          'output' in msg &&
          msg.output.message === newMessage?.output.message &&
          newMessage?.output.event !== 'Error' &&
          newMessage?.output.event !== 'CallProgress'
        )
      )
    ) {
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

  if ( keepAliveInterval ) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
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
