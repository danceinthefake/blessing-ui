<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessAvatar from "./BlessAvatar.vue";

defineOptions({ name: "BlessCallScreen" });
const pack = useLabelPack("BlessCallScreen");

export interface BlessCallPerson {
  id: string;
  name: string;
  avatar?: string;
  muted?: boolean;
  /** the camera is off: the tile shows the avatar */
  cameraOff?: boolean;
  speaking?: boolean;
}

const props = defineProps<{
  people: BlessCallPerson[];
  /** the time in the call, as text, for example "12:04" */
  elapsed?: string;
  labels?: Partial<{
    title: string;
    mute: string;
    camera: string;
    share: string;
    leave: string;
    muted: string;
    speaking: string;
    controls: string;
  }>;
}>();
const muted = defineModel<boolean>("muted", { default: false });
const camera = defineModel<boolean>("camera", { default: true });
const sharing = defineModel<boolean>("sharing", { default: false });
const emit = defineEmits<{ leave: [] }>();

const text = computed(() => ({
  title: "Call",
  mute: "Mute",
  camera: "Camera",
  share: "Share the screen",
  leave: "Leave the call",
  muted: "muted",
  speaking: "speaking",
  controls: "Call controls",
  ...pack(),
  ...props.labels,
}));
// two columns from two people, three from five
const cols = computed(() => (props.people.length > 4 ? 3 : props.people.length > 1 ? 2 : 1));
</script>

<template>
  <section class="bless-call" :aria-label="text.title">
    <ul class="bless-call__grid" :style="{ '--_cols': cols }">
      <li
        v-for="p in people"
        :key="p.id"
        class="bless-call__tile"
        :class="{ 'is-speaking': p.speaking }"
      >
        <div class="bless-call__video">
          <slot v-if="!p.cameraOff" name="video" :person="p" />
          <BlessAvatar
            v-if="p.cameraOff || !$slots.video"
            :name="p.name"
            :src="p.avatar"
            alt=""
            size="xl"
          />
        </div>
        <span class="bless-call__name">
          {{ p.name }}<span v-if="p.muted" class="bless-call__state">, {{ text.muted }}</span
          ><span v-if="p.speaking" class="bless-call__state">, {{ text.speaking }}</span>
        </span>
      </li>
    </ul>
    <div class="bless-call__bar" role="group" :aria-label="text.controls">
      <span v-if="elapsed" class="bless-call__time">{{ elapsed }}</span>
      <button type="button" class="bless-call__btn" :aria-pressed="muted" @click="muted = !muted">
        <span aria-hidden="true">{{ muted ? "✕" : "🎤︎" }}</span> {{ text.mute }}
      </button>
      <button
        type="button"
        class="bless-call__btn"
        :aria-pressed="camera"
        @click="camera = !camera"
      >
        <span aria-hidden="true">{{ camera ? "📷︎" : "⊘" }}</span> {{ text.camera }}
      </button>
      <button
        type="button"
        class="bless-call__btn"
        :aria-pressed="sharing"
        @click="sharing = !sharing"
      >
        <span aria-hidden="true">⇪</span> {{ text.share }}
      </button>
      <button type="button" class="bless-call__btn is-leave" @click="emit('leave')">
        <span aria-hidden="true">✆</span> {{ text.leave }}
      </button>
    </div>
  </section>
</template>

<style>
.bless-call {
  display: grid;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  background: #16171a;
  color: #f2f2f2;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
}
.bless-call__grid {
  display: grid;
  grid-template-columns: repeat(var(--_cols), minmax(0, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-call__tile {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #2a2c31;
}
/* the person who speaks gets a thick ring and the word; the ring alone is not enough */
.bless-call__tile.is-speaking {
  box-shadow: inset 0 0 0 3px var(--bless-color-accent);
}
.bless-call__video {
  display: grid;
  place-items: center;
  block-size: 100%;
}
.bless-call__video > video,
.bless-call__video > img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-call__name {
  position: absolute;
  inset-block-end: var(--bless-space-2);
  inset-inline-start: var(--bless-space-2);
  padding: 2px var(--bless-space-2);
  background: rgb(0 0 0 / 0.65);
  font-size: var(--bless-text-xs);
}
.bless-call__state {
  opacity: 0.85;
}
.bless-call__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--bless-space-2);
}
.bless-call__time {
  margin-inline-end: auto;
  font-variant-numeric: tabular-nums;
}
.bless-call__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--bless-space-1);
  min-block-size: 2.5rem;
  padding: 0 var(--bless-space-3);
  border: 1px solid #55585f;
  background: #2a2c31;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.bless-call__btn[aria-pressed="true"] {
  background: #f2f2f2;
  color: #16171a;
}
.bless-call__btn.is-leave {
  border-color: #c62828;
  background: #c62828;
  color: #fff;
}
.bless-call__btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}
</style>
