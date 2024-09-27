<script setup lang="ts">
import {
  computed, onMounted, ref, watch, nextTick
} from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

import type { UserMessage, SystemMessage } from '@/types/chat';

interface Props {
  message: UserMessage | SystemMessage;
}

const props = defineProps<Props>();
const copyButtonTexts = ref<{ [key: string]: string }>({});

function isSystemMessage(message: UserMessage | SystemMessage): message is SystemMessage {
  return (message as SystemMessage).author.toLowerCase() === 'system';
}

const renderedMarkdown = computed(() => {
  const renderer = new marked.Renderer();

  // Custom renderer for code blocks
  renderer.code = ({ text, lang }) => {
    const code = text;
    const language = lang;
    const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';
    const highlightedCode = hljs.highlight(code, { language: validLang }).value;
    const buttonId = generateId();

    copyButtonTexts.value[buttonId] = 'Copy';

    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-language">${ validLang }</span>
          <button 
            id="${ buttonId }"
            class="copy-button"
            data-code="${ code.replace(/"/g, '&quot;').replace(/\n/g, '\\n') }"
          >
            ${ copyButtonTexts.value[buttonId] }
          </button>
        </div>
        <pre class="code-block-pre">
          <code class="hljs ${ validLang }">${ highlightedCode }</code>
        </pre>
      </div>
    `;
  };

  const content = getMessageContent(props.message);

  if ( content ) {
    const rawHtml = marked(content, { renderer });

    return DOMPurify.sanitize(rawHtml as string);
  }

  return null;
});

function getMessageContent(message: UserMessage | SystemMessage) {
  if ( !isSystemMessage(message) && 'input' in message ) {
    return message.input;
  } else if ( message.output && 'message' in message.output ) {
    const { output } = message;

    if ( typeof output.message === 'string' && output.event !== 'Error' ) {
      return output.message;
    } else if ( output.event === 'Error' ) {
      const errorObj = output.error || {};
      const keys = Object.keys(errorObj);

      const outStr = keys.length ? `\n\`\`\`plaintext\n\n${ output.error }\n\`\`\`` : '';

      return `**Error: ${ output.message }**${ outStr }`;
    } else if ( output.content ) {
      return output.content;
    }
  }

  return '';
}

watch(renderedMarkdown, async() => {
  await nextTick();

  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', handleCopyClick);
  });
});

function handleCopyClick(event: Event) {
  const button = event.target as HTMLButtonElement;
  const code = button.dataset.code?.replace(/\\n/g, '\n').replace(/&quot;/g, '"') || '';

  if ( navigator.clipboard ) {
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = 'Copied!';

      setTimeout(() => {
        button.textContent = 'Copy';
      }, 1000);
    }).catch((err) => {
      console.error('Could not copy text: ', err);
      button.textContent = 'Copy failed';
    });
  } else {
    console.warn('Clipboard API not available');
    button.textContent = 'Copy not supported';
  }
}

function generateId() {
  return Math.random().toString(16).substring(2, 9);
}

onMounted(() => {
  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', handleCopyClick);
  });
});
</script>

<template>
  <div v-if="renderedMarkdown" :innerHTML="renderedMarkdown" class="markdown"></div>
</template>

<style scoped>
.markdown {
  line-height: 1.5;
}
</style>
