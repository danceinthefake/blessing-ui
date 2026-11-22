<template>
  <div class="assistant">
    <aside class="assistant__side">
      <BlessButton variant="outline" class="assistant__new" @click="newChat">New chat</BlessButton>
      <BlessChatHistory
        :selected="openId"
        :chats
        :now="new Date(today)"
        @select="open"
        @rename="rename"
        @remove="remove"
      />
    </aside>
    <section class="assistant__main" aria-label="Assistant">
      <header class="assistant__head">
        <BlessButton
          variant="ghost"
          size="sm"
          class="assistant__chats"
          :aria-expanded="sheet"
          @click="sheet = true"
          >Chats</BlessButton
        >
        <BlessModelPicker v-model="model" :models />
        <BlessButton variant="ghost" size="sm" class="assistant__chats" @click="newChat"
          >New chat</BlessButton
        >
      </header>
      <BlessMessageScroller
        v-if="turns.length"
        class="assistant__thread"
        height="100%"
        label="Conversation"
      >
        <template v-for="t in turns" :key="t.id">
          <BlessMessage name="You" align="end" compact>
            <BlessBubble variant="outline" align="end">{{ t.question }}</BlessBubble>
          </BlessMessage>
          <BlessMessage name="Assistant" compact>
            <div class="assistant__reply">
              <BlessReasoning
                v-if="t.thinking"
                :text="t.thinking"
                :streaming="t.thought === undefined && t.state === 'running'"
                :duration="t.thought"
              />
              <BlessAgentPlan v-if="t.steps.length" :steps="t.steps" />
              <BlessToolCall v-for="x in t.tools" :key="x.id" v-bind="x" />
              <BlessStreamingText
                v-if="t.text"
                :text="t.text"
                :done="t.state !== 'running'"
                class="assistant__text"
              />
              <BlessText v-if="t.state === 'stopped'" as="p" size="sm" muted
                >You stopped this reply.</BlessText
              >
              <BlessAlert v-if="t.state === 'failed'" color="danger">{{ t.error }}</BlessAlert>
              <BlessSources v-if="t.sources.length" :sources="t.sources" />
              <BlessMessageFeedback
                v-if="t.state !== 'running'"
                :copy="t.text || undefined"
                retry
                :reasons="['Not true', 'Not helpful', 'Too long']"
                @retry="retry(t.id)"
                @feedback="(f) => feedback(t.id, f.rating, f.reason)"
              />
            </div>
          </BlessMessage>
        </template>
      </BlessMessageScroller>
      <div v-else class="assistant__empty">
        <BlessText as="h1" size="lg" weight="light">How can I help?</BlessText>
        <BlessText as="p" muted>I answer from the help center and name my sources.</BlessText>
        <BlessSuggestions :items="starters" @select="(q: string) => ask(q)" />
      </div>
      <BlessPromptInput
        v-model="draft"
        class="assistant__prompt"
        :busy
        :labels="{ placeholder: 'Ask about orders, returns, or shipping' }"
        @send="onSend"
        @stop="stop"
      />
    </section>
    <BlessSheet v-model="sheet" title="Chats" side="left" size="20rem">
      <BlessChatHistory
        :selected="openId"
        :chats
        :now="new Date(today)"
        @select="(id) => (open(id), (sheet = false))"
        @rename="rename"
        @remove="remove"
      />
    </BlessSheet>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAgentPlan,
  BlessAlert,
  BlessBubble,
  BlessButton,
  BlessChatHistory,
  BlessMessage,
  BlessMessageFeedback,
  BlessMessageScroller,
  BlessModelPicker,
  BlessPromptInput,
  BlessReasoning,
  BlessSheet,
  BlessSources,
  BlessStreamingText,
  BlessSuggestions,
  BlessText,
  BlessToolCall,
} from "blessing-ui";
import { mockAssistantApi } from "./api";
import { useAssistant } from "./useAssistant";

const today = "2026-11-22T10:00:00Z";
const {
  models,
  model,
  chats,
  openId,
  turns,
  busy,
  ask,
  stop,
  retry,
  newChat,
  open,
  rename,
  remove,
  feedback,
} = useAssistant(mockAssistantApi, () => new Date().toISOString());

const starters = [
  "How long do I have to return an item?",
  "My parcel is late. What now?",
  "Can I change the address of an order?",
];
const draft = ref("");
const sheet = ref(false);
function onSend({ text }: { text: string }) {
  ask(text);
  draft.value = "";
}
</script>

<style scoped>
.assistant {
  display: grid;
  grid-template-columns: 16rem minmax(0, 1fr);
  height: 100%;
  min-height: 560px;
}
.assistant__side {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--bless-space-3);
  min-height: 0;
  padding: var(--bless-space-4);
  overflow: auto;
  border-inline-end: var(--bless-border-width) solid var(--bless-color-border);
}
.assistant__main {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-width: 0;
  min-height: 0;
}
.assistant__head {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding: var(--bless-space-2) var(--bless-space-4);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.assistant__chats {
  display: none;
}
.assistant__thread {
  min-height: 0;
  padding: var(--bless-space-4);
}
.assistant__reply {
  display: grid;
  gap: var(--bless-space-3);
  max-width: 44rem;
}
.assistant__text {
  line-height: var(--bless-leading-relaxed, 1.6);
}
.assistant__empty {
  display: grid;
  gap: var(--bless-space-3);
  align-content: center;
  justify-items: start;
  max-width: 36rem;
  padding: var(--bless-space-6);
}
.assistant__prompt {
  margin: var(--bless-space-3) var(--bless-space-4) var(--bless-space-4);
}
@media (max-width: 760px) {
  .assistant {
    grid-template-columns: minmax(0, 1fr);
  }
  .assistant__side {
    display: none;
  }
  .assistant__chats {
    display: inline-flex;
  }
  .assistant__head > :last-child {
    margin-inline-start: auto;
  }
  .assistant__empty {
    padding: var(--bless-space-4);
  }
}
</style>
