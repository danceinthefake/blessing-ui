<script lang="ts">
/** A key with only its start and its last four letters, for example `sk_demo_••••••••3f9a`. */
export function maskKey(key: string): string {
  const head = key.match(/^[a-z]+_(?:[a-z]+_)?/i)?.[0] ?? "";
  if (key.length <= head.length + 4) return "•".repeat(Math.max(8, key.length));
  return `${head}${"•".repeat(8)}${key.slice(-4)}`;
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { copyText } from "../composables/copyText";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";
import BlessConfirmPopup from "./BlessConfirmPopup.vue";
import "./sr.css";

defineOptions({ name: "BlessApiKeyField" });
const pack = useLabelPack("BlessApiKeyField");

const props = withDefaults(
  defineProps<{
    /** the secret key */
    value: string;
    /** the name of the key, for example "Upload script" */
    name?: string;
    /** when the key was made, as text */
    created?: string;
    /** when the key was last used, as text */
    lastUsed?: string;
    /** show the button that makes a new key; false hides it */
    regenerable?: boolean;
    labels?: Partial<{
      show: string;
      hide: string;
      copy: string;
      copied: string;
      regenerate: string;
      confirm: string;
      confirmLabel: string;
      cancel: string;
      created: (when: string) => string;
      lastUsed: (when: string) => string;
    }>;
  }>(),
  { regenerable: true },
);
const emit = defineEmits<{ regenerate: []; copy: [] }>();

const text = computed(() => ({
  show: "Show the key",
  hide: "Hide the key",
  copy: "Copy",
  copied: "Copied",
  regenerate: "Make a new key",
  confirm: "The old key stops working at once. Apps that use it must get the new key.",
  confirmLabel: "Make a new key",
  cancel: "Cancel",
  created: (w: string) => `Made ${w}`,
  lastUsed: (w: string) => `Last used ${w}`,
  ...pack(),
  ...props.labels,
}));
const shown = ref(false);
const copied = ref(false);
const status = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;
async function copy() {
  await copyText(props.value);
  emit("copy");
  copied.value = true;
  status.value = text.value.copied;
  clearTimeout(timer);
  timer = setTimeout(() => ((copied.value = false), (status.value = "")), 2000);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="bless-apikey">
    <p v-if="name" class="bless-apikey__name">{{ name }}</p>
    <div class="bless-apikey__row">
      <code class="bless-apikey__value" :class="{ 'is-shown': shown }">
        <template v-if="shown">{{ value }}</template>
        <template v-else>
          <span aria-hidden="true">{{ maskKey(value) }}</span>
          <span class="bless-sr">{{ maskKey(value).replace(/•+/, " … ") }}</span>
        </template>
      </code>
      <BlessButton
        variant="ghost"
        size="sm"
        :aria-pressed="shown"
        :aria-label="text.show"
        :title="shown ? text.hide : text.show"
        @click="shown = !shown"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
          <circle cx="8" cy="8" r="2" />
          <path v-if="shown" d="M2.5 2.5l11 11" />
        </svg>
      </BlessButton>
      <BlessButton variant="outline" size="sm" @click="copy">
        {{ copied ? text.copied : text.copy }}
      </BlessButton>
      <BlessConfirmPopup
        v-if="regenerable"
        :message="text.confirm"
        :labels="{ confirm: text.confirmLabel, cancel: text.cancel }"
        color="danger"
        @confirm="emit('regenerate')"
      >
        <template #trigger>
          <BlessButton variant="ghost" size="sm" color="danger">{{ text.regenerate }}</BlessButton>
        </template>
      </BlessConfirmPopup>
    </div>
    <p v-if="created || lastUsed" class="bless-apikey__meta">
      {{
        [created && text.created(created), lastUsed && text.lastUsed(lastUsed)]
          .filter(Boolean)
          .join(" · ")
      }}
    </p>
    <span class="bless-sr" role="status">{{ status }}</span>
  </div>
</template>

<style>
.bless-apikey {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-1);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-apikey__name {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-apikey__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--bless-space-1);
}
.bless-apikey__value {
  flex: 1;
  min-inline-size: 12rem;
  padding: var(--bless-space-2) var(--bless-space-3);
  overflow: hidden;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface-2);
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* a shown key can be read in full, so it wraps */
.bless-apikey__value.is-shown {
  overflow-wrap: anywhere;
  white-space: normal;
}
.bless-apikey__row svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.bless-apikey__meta {
  margin: 0;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
</style>
