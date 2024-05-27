import type { WebsocketConfig } from '@/types/chat';

export function getWebsocketConfig(): WebsocketConfig {
  const secure = import.meta.env.VITE_WS_SECURE === true;
  const host = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const port = import.meta.env.VITE_WS_PORT || '';
  const path = import.meta.env.VITE_WS_PATH || '/ws/';

  return {
    secure,
    host,
    port,
    path
  };
}
