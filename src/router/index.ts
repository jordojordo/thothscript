import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import ConfigView from '@/views/ConfigView.vue';
import ChatView from '@/views/ChatView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:  [
    {
      path:      '/',
      name:      'home',
      component: HomeView,
      redirect:  '/chat',
      children:  [
        {
          path:      'chat',
          name:      'chat',
          component: ChatView
        },
        {
          path:      'config',
          name:      'config',
          component: ConfigView
        }
      ]
    }
  ]
});

export default router;
