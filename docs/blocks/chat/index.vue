<script setup lang="ts">
import {
  BlessAvatar,
  BlessBubble,
  BlessButton,
  BlessMessage,
  BlessMessageScroller,
  BlessText,
  BlessTextarea,
} from "blessing-ui";
import { useChat } from "./useChat";

const { messages, draft, typing, send } = useChat();
</script>

<template>
  <div class="chat">
    <header class="chat__head">
      <BlessAvatar name="加藤 恵" size="sm" />
      <div>
        <BlessText weight="bold" size="sm">加藤 恵</BlessText>
        <BlessText as="p" size="2xs" muted>{{ typing ? "typing…" : "online" }}</BlessText>
      </div>
    </header>
    <BlessMessageScroller class="chat__thread" height="100%">
      <BlessMessage
        v-for="m in messages"
        :key="m.id"
        :name="m.from === 'them' ? '加藤 恵' : undefined"
        :time="m.time"
        :align="m.from === 'me' ? 'end' : 'start'"
        compact
      >
        <template v-if="m.from === 'them'" #avatar
          ><BlessAvatar name="加藤 恵" size="xs"
        /></template>
        <BlessBubble
          :variant="m.from === 'me' ? 'accent' : 'surface'"
          :align="m.from === 'me' ? 'end' : 'start'"
          >{{ m.text }}</BlessBubble
        >
      </BlessMessage>
      <BlessMessage v-if="typing" name="加藤 恵" compact>
        <template #avatar><BlessAvatar name="加藤 恵" size="xs" /></template>
        <BlessBubble variant="surface"
          ><span class="chat__dots" aria-label="typing">···</span></BlessBubble
        >
      </BlessMessage>
    </BlessMessageScroller>
    <form class="chat__composer" @submit.prevent="send">
      <BlessTextarea
        v-model="draft"
        :rows="1"
        autogrow
        placeholder="Message"
        aria-label="Message"
        @keydown.enter.exact.prevent="send"
      />
      <BlessButton type="submit" color="accent" :disabled="!draft.trim()">Send</BlessButton>
    </form>
  </div>
</template>

<style scoped>
.chat {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  min-height: 400px;
}
.chat__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3) var(--bless-space-4);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.chat__thread {
  min-height: 0;
  padding: var(--bless-space-4);
}
.chat__dots {
  letter-spacing: 0.2em;
  animation: chat-blink 1s steps(2) infinite;
}
@keyframes chat-blink {
  50% {
    opacity: 0.3;
  }
}
.chat__composer {
  display: flex;
  gap: var(--bless-space-2);
  align-items: flex-end;
  padding: var(--bless-space-3) var(--bless-space-4);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
}
.chat__composer > :first-child {
  flex: 1;
}
</style>
