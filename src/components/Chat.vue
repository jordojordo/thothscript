<script setup lang="ts">
import {
  ref, computed, nextTick, watch, onMounted
} from 'vue';
import { useWindowSize } from '@vueuse/core';
import websocket from '@/services/websocket';
import Markdown from '@/components/Markdown.vue';
import IconSend from '@/components/IconSend.vue';

const { state, send } = websocket;

const { width } = useWindowSize();

const newMessage = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const systemMessagesRef = ref<HTMLElement | null>(null);

const handleKeyDown = (event: KeyboardEvent) => {
  if ( event.key === 'Enter' && !event.shiftKey ) {
    event.preventDefault(); // Prevent default Enter behavior (new line)
    sendMessage();
  }
};

const sendMessage = () => {
  if ( newMessage.value.trim() ) {
    send(newMessage.value);
    newMessage.value = '';

    nextTick(() => adjustTextareaHeight()); // Reset textarea height after sending the message
  }
};

const adjustTextareaHeight = () => {
  const textarea = textareaRef.value;

  if ( textarea ) {
    textarea.style.height = 'auto';
    textarea.style.height = `${ textarea.scrollHeight }px`;
  }
};

const scrollToBottom = () => {
  const systemMessages = systemMessagesRef.value;

  if ( systemMessages ) {
    if ( width.value < 725 ) {
      // Use useWindowScroll for larger screens
      window.scrollTo({
        top:      systemMessages.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      // Directly manipulate scrollTop for smaller screens
      systemMessages.scrollTo({
        top:      systemMessages.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
};

const messages = computed(() => {
  return state.messages.slice().sort((a, b) => a.id - b.id);
});

watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});


onMounted(() => {
  nextTick(() => {
    if ( textareaRef.value ) {
      textareaRef.value.focus();
    }

    scrollToBottom();
  });
});
</script>

<template>
  <div class="chat-container">
    <div class="chat-messages" ref="systemMessagesRef">
      <div
        v-for="message in messages" :key="message.id"
        class="message"
        :class="{
          'message user-message': message.author.toLowerCase() !== 'system',
          'message gpt-message': message.author.toLowerCase() === 'system'
        }"
      >
        <Markdown class="text" :message="message" />
      </div>
    </div>
    <div class="chat-input">
      <div class="input-container">
        <textarea
          v-model="newMessage"
          @input="adjustTextareaHeight"
          @keydown="handleKeyDown"
          placeholder="Message Thoth..."
          rows="1"
          ref="textareaRef"
        />
        <button @click="sendMessage" class="send-button">
          <IconSend />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1500px;
  margin: 0 auto;
  border: 0;
  border-radius: 0;
  overflow: hidden;
  background-color: var(--background-primary);
  position: relative;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: var(--background-primary);
}

.scroll-button-wrapper {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 6rem;
  width: 100%;
}

.chat-input {
  display: flex;
  flex-direction: column;
  margin: 0 4rem;
  padding: 1rem;
  border-top: 1px solid var(--foreground-tertiary);
  border-left: 1px solid var(--foreground-tertiary);
  border-right: 1px solid var(--foreground-tertiary);
  border-radius: 8px 8px 0 0;
  background-color: var(--background-secondary);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.scroll-button {
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: var(--foreground-button);
  color: var(--white);
  cursor: pointer;
}

.scroll-button:hover {
  background-color: var(--background-tertiary);
}

.message {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
}

.user-message {
  justify-content: flex-end;
}

:deep(.user-message .text p) {
  margin: 0;
}

.gpt-message {
  justify-content: flex-start;
}

.user-message .text {
  background-color: var(--background-secondary);
  padding: .625rem 1.25rem;
  border-radius: 10px;
  color: var(--foreground-primary);
}

.error-details {
  justify-content: flex-start;
  background-color: var(--red);
  color: var(--white);
  padding: 10px;
  border-radius: 10px;
}

.gpt-message .text {
  padding: 10px;
  border-radius: 10px;
}

.author {
  font-weight: bold;
  margin-right: 5px;
  color: var(--foreground-highlight);
}

.text {
  word-wrap: break-word;
  text-align: left;
  max-width: 90%;
}

textarea:focus {
  outline: none !important;
  border-color: var(--foreground-button);
  box-shadow: 0 0 4px var(--foreground-button);
}

textarea {
  resize: none;
  width: 100%;
  padding: 8px;
  font-size: 16px;
  line-height: 1.5;
  border-radius: 4px;
  border: 1px solid var(--foreground-tertiary);
  padding-right: 50px;
  overflow-y: hidden;
  max-height: 250px;
  background-color: var(--white);
  color: var(--black);
  box-sizing: border-box;
}

.send-button {
  position: absolute;
  bottom: 0;
  right: 4px;
  width: 42px;
  height: 42px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-actions {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

:deep(.svg) {
  stroke: var(--foreground-primary);
}

:deep(.svg:hover) {
  fill: var(--foreground-button);
  stroke: var(--white)
}

@media (max-width: 1075px) {
  .chat-input {
    margin: 0 2rem;
  }
}

@media (max-width: 725px) {
  .chat-container{
    height: auto;
    padding: 2rem 0;
  }

  .chat-messages {
    height: calc(100vh - 8rem); /* Adjust to ensure messages container has a height */
  }

  .scroll-button-wrapper {
    position: fixed;
  }

  .chat-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 1rem;
    padding: .5rem;
  }

  textarea {
    margin-bottom: 0;
  }
}
</style>
