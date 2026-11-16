<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";
import BlessModal from "./BlessModal.vue";
import "./sr.css";

defineOptions({ name: "BlessStories" });
const pack = useLabelPack("BlessStories");

export interface BlessStory {
  id: string;
  image: string;
  /** describe the picture */
  alt: string;
  caption?: string;
  /** when it was posted, as text */
  time?: string;
}
export interface BlessStoryPerson {
  id: string;
  name: string;
  avatar?: string;
  /** the reader saw all the stories of this person */
  seen?: boolean;
  stories: BlessStory[];
}

const props = withDefaults(
  defineProps<{
    people: BlessStoryPerson[];
    /** seconds for each story */
    duration?: number;
    labels?: Partial<{
      title: string;
      open: (name: string) => string;
      new: string;
      previous: string;
      next: string;
      pause: string;
      play: string;
      progress: (n: number, total: number) => string;
    }>;
  }>(),
  { duration: 5 },
);
const emit = defineEmits<{ seen: [personId: string, storyId: string] }>();

const text = computed(() => ({
  title: "Stories",
  open: (n: string) => `Stories of ${n}`,
  new: "new",
  previous: "Previous story",
  next: "Next story",
  pause: "Pause",
  play: "Play",
  progress: (n: number, t: number) => `Story ${n} of ${t}`,
  ...pack(),
  ...props.labels,
}));
const open = ref(false);
const who = ref(0);
const at = ref(0);
const elapsed = ref(0);
const paused = ref(false);
const person = computed(() => props.people[who.value]);
const story = computed(() => person.value?.stories[at.value]);
let timer: ReturnType<typeof setInterval> | undefined;
const stop = () => timer && (clearInterval(timer), (timer = undefined));

function show(p: number) {
  who.value = p;
  at.value = 0;
  elapsed.value = 0;
  paused.value = false;
  open.value = true;
}
function step(d: 1 | -1) {
  elapsed.value = 0;
  const n = at.value + d;
  if (n >= 0 && n < (person.value?.stories.length ?? 0)) at.value = n;
  else if (d === 1 && who.value + 1 < props.people.length) (who.value++, (at.value = 0));
  else if (d === -1 && who.value > 0)
    (who.value--, (at.value = props.people[who.value]!.stories.length - 1));
  else if (d === 1) open.value = false;
}
// tick in tenths of a second; the bar of the story shows how far it is
watch([open, paused], ([o, p]) => {
  stop();
  if (o && !p)
    timer = setInterval(() => {
      elapsed.value += 0.1;
      if (elapsed.value >= props.duration) step(1);
    }, 100);
});
watch(story, (s) => s && open.value && emit("seen", person.value!.id, s.id));
watch(open, (o) => o && story.value && emit("seen", person.value!.id, story.value.id));
onBeforeUnmount(stop);
function onKey(e: KeyboardEvent) {
  if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
  else return;
  e.preventDefault();
}
</script>

<template>
  <div class="bless-stories">
    <ul class="bless-stories__rings" :aria-label="text.title">
      <li v-for="(p, i) in people" :key="p.id">
        <button
          type="button"
          class="bless-stories__ring"
          :class="{ 'is-seen': p.seen }"
          @click="show(i)"
        >
          <span class="bless-stories__avatar"
            ><BlessAvatar :name="p.name" :src="p.avatar" alt="" size="lg"
          /></span>
          <span class="bless-stories__name">{{ p.name }}</span>
          <span class="bless-sr">{{ text.open(p.name) }}{{ p.seen ? "" : `, ${text.new}` }}</span>
        </button>
      </li>
    </ul>
    <BlessModal v-model="open" size="sm" :title="person?.name" class="bless-stories__modal">
      <div v-if="story" class="bless-stories__viewer" @keydown="onKey">
        <div class="bless-stories__bars" aria-hidden="true">
          <span v-for="(s, i) in person!.stories" :key="s.id" class="bless-stories__bar">
            <span
              class="bless-stories__fill"
              :style="{
                inlineSize:
                  i < at ? '100%' : i > at ? '0%' : `${Math.min(100, (elapsed / duration) * 100)}%`,
              }"
            />
          </span>
        </div>
        <p class="bless-sr" aria-live="polite">
          {{ text.progress(at + 1, person!.stories.length) }}
        </p>
        <img class="bless-stories__image" :src="story.image" :alt="story.alt" />
        <p v-if="story.caption || story.time" class="bless-stories__caption">
          {{ story.caption
          }}<span v-if="story.time" class="bless-stories__time">{{ story.time }}</span>
        </p>
        <div class="bless-stories__controls">
          <button type="button" :aria-label="text.previous" @click="step(-1)">‹</button>
          <button
            type="button"
            :aria-pressed="paused"
            :aria-label="paused ? text.play : text.pause"
            @click="paused = !paused"
          >
            {{ paused ? "▶" : "❚❚" }}
          </button>
          <button type="button" :aria-label="text.next" @click="step(1)">›</button>
        </div>
      </div>
    </BlessModal>
  </div>
</template>

<style>
.bless-stories__rings {
  display: flex;
  gap: var(--bless-space-3);
  margin: 0;
  padding: var(--bless-space-1);
  overflow-x: auto;
  list-style: none;
}
.bless-stories__ring {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-1);
  inline-size: 4.75rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--bless-color-text);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-xs);
  cursor: pointer;
}
/* a new story has a solid ring in the accent color; a seen one has a thin dashed gray ring */
.bless-stories__avatar {
  padding: 3px;
  border: 3px solid var(--bless-color-accent);
  border-radius: 50%;
}
.is-seen .bless-stories__avatar {
  border: 2px dashed var(--bless-color-border);
  padding: 4px;
}
.bless-stories__ring:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
.bless-stories__name {
  max-inline-size: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bless-stories__viewer {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
}
.bless-stories__bars {
  display: flex;
  gap: 3px;
}
.bless-stories__bar {
  flex: 1;
  block-size: 3px;
  background: var(--bless-color-surface-2);
}
.bless-stories__fill {
  display: block;
  block-size: 100%;
  background: var(--bless-color-text);
}
.bless-stories__image {
  inline-size: 100%;
  aspect-ratio: 9 / 16;
  max-block-size: 60vh;
  object-fit: cover;
  background: var(--bless-color-surface-2);
}
.bless-stories__caption {
  display: flex;
  justify-content: space-between;
  gap: var(--bless-space-2);
  margin: 0;
}
.bless-stories__time {
  color: var(--bless-color-text-muted);
  font-size: var(--bless-text-xs);
  white-space: nowrap;
}
.bless-stories__controls {
  display: flex;
  justify-content: center;
  gap: var(--bless-space-2);
}
.bless-stories__controls button {
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: var(--bless-color-text);
  font: inherit;
  cursor: pointer;
}
.bless-stories__controls button:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 2px;
}
</style>
