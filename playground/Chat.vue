<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import {
  BlessAttachment,
  BlessBubble,
  BlessButton,
  BlessInput,
  BlessInputGroup,
  BlessMarker,
  BlessMessage,
  BlessMessageScroller,
  BlessQuestionnaire,
  BlessThemeToggle,
  type BlessAnswers,
  type BlessQuestion,
} from "blessing-ui";

type Msg = { id: number; who: "megumi" | "me"; text: string; time: string };
let id = 0;
const line = (who: Msg["who"], text: string): Msg => ({
  id: ++id,
  who,
  text,
  time: `12:${String(id).padStart(2, "0")}`,
});
const messages = ref<Msg[]>([
  line("megumi", "おはよう。今日の予定は？"),
  line("me", "脚本の続き。第3話まで。"),
  line("me", "夜までには送る。"),
  line("megumi", "了解。急がなくていいよ。"),
]);
const draft = ref("");
const scroller = useTemplateRef<InstanceType<typeof BlessMessageScroller>>("scroller");
const streaming = ref(false);

function send() {
  if (!draft.value.trim()) return;
  messages.value.push(line("me", draft.value));
  draft.value = "";
  reply();
}
async function reply() {
  streaming.value = true;
  const m = line("megumi", "");
  messages.value.push(m);
  for (const ch of "そうなんだ。じゃあ、私は買い出しに行ってくるね。何か要る？") {
    await new Promise((r) => setTimeout(r, 40));
    m.text += ch;
  }
  streaming.value = false;
}
function loadHistory() {
  scroller.value?.loadHistory(() => {
    const older = Array.from({ length: 8 }, (_, i) =>
      line(i % 2 ? "me" : "megumi", `（過去ログ ${messages.value.length + i + 1}）`),
    );
    messages.value.unshift(...older);
  });
}

const questions: BlessQuestion[] = [
  {
    name: "heroine",
    title: "Who is the main heroine?",
    description: "One answer.",
    type: "single",
    choices: [
      { value: "megumi", label: "Megumi", description: "flat, but…" },
      { value: "eriri", label: "Eriri" },
      { value: "utaha", label: "Utaha" },
    ],
  },
  {
    name: "watched",
    title: "Which have you watched?",
    type: "multiple",
    choices: [
      { value: "s1", label: "Season 1" },
      { value: "s2", label: "♭" },
      { value: "fine", label: "Fine" },
    ],
  },
  {
    name: "note",
    title: "Anything else?",
    type: "freeform",
    skippable: true,
    required: false,
    placeholder: "optional",
  },
];
const answers = ref<BlessAnswers>({});
const submitted = ref<BlessAnswers>();
</script>

<template>
  <main class="pg">
    <h1>Blessing UI — chat</h1>
    <div class="row" style="align-items: center">
      <p>
        <a href="/">← components</a> · <a href="/composite.html">composite</a> ·
        <a href="/forms.html">forms</a>
      </p>
      <BlessThemeToggle />
    </div>

    <section>
      <h2>MessageScroller + Message + Bubble + Marker</h2>
      <div class="col" style="max-width: 560px">
        <BlessMessageScroller
          ref="scroller"
          height="360px"
          style="border: var(--bless-border-width) solid var(--bless-color-border)"
          @reach-top="loadHistory"
        >
          <BlessMarker variant="separator">Today</BlessMarker>
          <template v-for="(m, i) in messages" :key="m.id">
            <BlessMessage
              :id="`msg-${m.id}`"
              :name="m.who === 'me' ? 'Tomoya' : 'Megumi'"
              :time="m.time"
              :align="m.who === 'me' ? 'end' : 'start'"
              :compact="messages[i - 1]?.who === m.who"
            >
              <BlessBubble
                :align="m.who === 'me' ? 'end' : 'start'"
                :variant="m.who === 'me' ? 'accent' : 'surface'"
              >
                {{ m.text }}
              </BlessBubble>
            </BlessMessage>
          </template>
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
        <p style="font-size: var(--bless-text-xs); color: var(--bless-color-text-muted)">
          Scroll to top → loads 8 older lines without jumping. Scroll up, send → “↓ Latest” appears.
        </p>
      </div>
    </section>

    <section>
      <h2>Bubble variants + reactions</h2>
      <div class="col" style="max-width: 480px">
        <BlessBubble>surface (default)</BlessBubble>
        <BlessBubble variant="outline">outline</BlessBubble>
        <BlessBubble variant="plain">plain — no box</BlessBubble>
        <BlessBubble
          variant="accent"
          align="end"
          :reactions="[
            { emoji: '👍', count: 3, active: true },
            { emoji: '🎉', count: 1 },
          ]"
        >
          accent, end, reactions
        </BlessBubble>
        <BlessBubble collapsible :lines="2">
          Long text clamped to two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </BlessBubble>
      </div>
    </section>

    <section>
      <h2>Marker variants</h2>
      <div class="col" style="max-width: 480px">
        <BlessMarker>status pill</BlessMarker>
        <BlessMarker variant="note" color="info"
          ><template #icon>ℹ</template>note, muted line</BlessMarker
        >
        <BlessMarker variant="separator">separator</BlessMarker>
        <BlessMarker variant="border" color="danger"
          ><template #icon>⚠</template>border row, danger</BlessMarker
        >
        <BlessMarker shimmer>shimmer while pending</BlessMarker>
      </div>
    </section>

    <section>
      <h2>Attachment</h2>
      <div class="row">
        <BlessAttachment name="script_ep03.pdf" description="212 KB" removable />
        <BlessAttachment
          name="storyboard.png"
          description="1.4 MB"
          src="https://picsum.photos/seed/bless/96"
          href="#"
        />
        <BlessAttachment
          name="upload.zip"
          description="uploading…"
          state="uploading"
          :progress="62"
        />
        <BlessAttachment name="raw.mov" state="uploading" size="sm" />
        <BlessAttachment name="bad.exe" state="error" removable />
      </div>
    </section>

    <section>
      <h2>Questionnaire</h2>
      <div class="col" style="max-width: 480px">
        <BlessQuestionnaire v-model="answers" :questions @submit="submitted = $event" />
        <pre style="font-size: var(--bless-text-xs)">{{ submitted ?? answers }}</pre>
      </div>
    </section>
  </main>
</template>
