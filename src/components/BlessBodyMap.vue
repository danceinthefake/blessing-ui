<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessBodyMap" });
const pack = useLabelPack("BlessBodyMap");

export type BlessBodyPart =
  | "head"
  | "neck"
  | "chest"
  | "belly"
  | "pelvis"
  | "rightArm"
  | "leftArm"
  | "rightHand"
  | "leftHand"
  | "rightLeg"
  | "leftLeg"
  | "rightFoot"
  | "leftFoot";

const props = defineProps<{
  labels?: Partial<
    Record<BlessBodyPart, string> & {
      title: string;
      chosen: (parts: string) => string;
      none: string;
    }
  >;
}>();
/** the parts the person points at */
const selected = defineModel<BlessBodyPart[]>({ default: () => [] });

const text = computed(() => ({
  title: "Where does it hurt?",
  head: "Head",
  neck: "Neck",
  chest: "Chest",
  belly: "Belly",
  pelvis: "Hips",
  rightArm: "Right arm",
  leftArm: "Left arm",
  rightHand: "Right hand",
  leftHand: "Left hand",
  rightLeg: "Right leg",
  leftLeg: "Left leg",
  rightFoot: "Right foot",
  leftFoot: "Left foot",
  chosen: (p: string) => `Chosen: ${p}`,
  none: "Nothing chosen yet.",
  ...pack(),
  ...props.labels,
}));
// a front view: the right side of the person is on the left of the picture
const SHAPES: { part: BlessBodyPart; d: string }[] = [
  { part: "head", d: "M100 8a22 26 0 1 1 0 52a22 26 0 1 1 0-52z" },
  { part: "neck", d: "M90 60h20v14h-20z" },
  { part: "chest", d: "M64 76h72l-4 62h-64z" },
  { part: "belly", d: "M68 140h64l-2 46h-60z" },
  { part: "pelvis", d: "M68 188h64l6 34h-76z" },
  { part: "rightArm", d: "M44 80h18l-6 120h-16z" },
  { part: "leftArm", d: "M138 80h18l4 120h-16z" },
  { part: "rightHand", d: "M38 204h18v26h-18z" },
  { part: "leftHand", d: "M144 204h18v26h-18z" },
  { part: "rightLeg", d: "M64 224h32l-4 150h-22z" },
  { part: "leftLeg", d: "M104 224h32l-6 150h-22z" },
  { part: "rightFoot", d: "M62 376h30v14h-36z" },
  { part: "leftFoot", d: "M108 376h30l6 14h-36z" },
];
const on = (p: BlessBodyPart) => selected.value.includes(p);
const flip = (p: BlessBodyPart) =>
  (selected.value = on(p) ? selected.value.filter((x) => x !== p) : [...selected.value, p]);
function onKey(e: KeyboardEvent, p: BlessBodyPart) {
  if (e.key !== " " && e.key !== "Enter") return;
  e.preventDefault();
  flip(p);
}
const chosenText = computed(() =>
  selected.value.length
    ? text.value.chosen(selected.value.map((p) => text.value[p]).join(", "))
    : text.value.none,
);
</script>

<template>
  <figure class="bless-body">
    <svg viewBox="0 0 200 400" class="bless-body__svg" role="group" :aria-label="text.title">
      <path
        v-for="s in SHAPES"
        :key="s.part"
        :d="s.d"
        class="bless-body__part"
        :class="{ 'is-on': on(s.part) }"
        role="checkbox"
        tabindex="0"
        :aria-checked="on(s.part)"
        :aria-label="text[s.part]"
        @click="flip(s.part)"
        @keydown="onKey($event, s.part)"
      >
        <title>{{ text[s.part] }}</title>
      </path>
    </svg>
    <figcaption class="bless-body__chosen" aria-live="polite">{{ chosenText }}</figcaption>
  </figure>
</template>

<style>
.bless-body {
  display: grid;
  justify-items: center;
  gap: var(--bless-space-2);
  margin: 0;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-body__svg {
  inline-size: 100%;
  max-inline-size: 14rem;
  block-size: auto;
}
.bless-body__part {
  fill: var(--bless-color-surface-2);
  stroke: var(--bless-color-text);
  stroke-width: 1.5;
  cursor: pointer;
}
.bless-body__part:hover {
  fill: color-mix(in srgb, var(--bless-color-accent) 20%, var(--bless-color-surface-2));
}
/* a chosen part is filled and gets a thick dashed edge, so it does not rest on the fill alone */
.bless-body__part.is-on {
  fill: var(--bless-color-accent);
  stroke-width: 3;
  stroke-dasharray: 5 3;
}
.bless-body__part:focus-visible {
  outline: none;
  stroke: var(--bless-color-accent);
  stroke-width: 4;
}
.bless-body__part.is-on:focus-visible {
  stroke: var(--bless-color-text);
}
.bless-body__chosen {
  text-align: center;
}
</style>
