<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import {
  BlessBubble,
  BlessButton,
  BlessInput,
  BlessInputGroup,
  BlessMarker,
  BlessMessage,
  BlessMessageScroller,
} from "blessing-ui";

type Msg = { id: number; who: "megumi" | "me"; text: string };
let id = 0;
const line = (who: Msg["who"], text: string): Msg => ({ id: ++id, who, text });
const messages = ref<Msg[]>([
  line("megumi", "おはよう。今日の予定は？"),
  line("me", "脚本の続き。第3話まで。"),
  line("me", "夜までには送る。"),
  line("megumi", "了解。急がなくていいよ。"),
]);
const draft = ref("");
const streaming = ref(false);
const scroller = useTemplateRef<InstanceType<typeof BlessMessageScroller>>("scroller");

async function send() {
  if (!draft.value.trim()) return;
  messages.value.push(line("me", draft.value));
  draft.value = "";
  streaming.value = true;
  const m = line("megumi", "");
  messages.value.push(m);
  for (const ch of "そうなんだ。じゃあ、私は買い出しに行ってくるね。") {
    await new Promise((r) => setTimeout(r, 40));
    m.text += ch;
  }
  streaming.value = false;
}
function loadHistory() {
  scroller.value?.loadHistory(() => {
    messages.value.unshift(
      ...Array.from({ length: 8 }, (_, i) =>
        line(i % 2 ? "me" : "megumi", `（過去ログ ${i + 1}）`),
      ),
    );
  });
}
</script>

<template>
  <div class="col" style="max-width: 560px">
    <BlessMessageScroller
      ref="scroller"
      height="320px"
      style="border: 1px solid var(--bless-color-border)"
      @reach-top="loadHistory"
    >
      <BlessMarker variant="separator">Today</BlessMarker>
      <BlessMessage
        v-for="(m, i) in messages"
        :key="m.id"
        :name="m.who === 'me' ? 'Tomoya' : 'Megumi'"
        :align="m.who === 'me' ? 'end' : 'start'"
        :compact="messages[i - 1]?.who === m.who"
      >
        <BlessBubble
          :align="m.who === 'me' ? 'end' : 'start'"
          :variant="m.who === 'me' ? 'accent' : 'surface'"
          >{{ m.text }}</BlessBubble
        >
      </BlessMessage>
      <BlessMarker v-if="streaming" shimmer>Megumi is typing…</BlessMarker>
    </BlessMessageScroller>
    <form @submit.prevent="send">
      <BlessInputGroup>
        <BlessInput v-model="draft" placeholder="message" />
        <template #suffix
          ><BlessButton size="sm" color="accent" type="submit">Send</BlessButton></template
        >
      </BlessInputGroup>
    </form>
    <small
      >Scroll to top → loads 8 older lines without jumping. Scroll up, send → “↓ Latest”
      appears.</small
    >
  </div>
</template>
