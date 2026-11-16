<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId } from "vue";
import { useLabelPack } from "../composables/useLabels";
import "./sr.css";
import BlessAvatar from "./BlessAvatar.vue";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessPostComposer" });
const pack = useLabelPack("BlessPostComposer");

export interface BlessNewPost {
  text: string;
  images: File[];
  /** the choices of a poll, when there is one */
  poll?: string[];
}

const props = withDefaults(
  defineProps<{
    /** the author, for the avatar */
    author?: { name: string; avatar?: string };
    /** the most characters in a post */
    max?: number;
    /** the most images in a post */
    maxImages?: number;
    labels?: Partial<{
      placeholder: string;
      left: (count: number) => string;
      over: (count: number) => string;
      image: string;
      poll: string;
      choice: (n: number) => string;
      addChoice: string;
      removeImage: (n: number) => string;
      post: string;
    }>;
  }>(),
  { max: 280, maxImages: 4 },
);
const text = defineModel<string>({ default: "" });
const emit = defineEmits<{ post: [post: BlessNewPost] }>();

const t = computed(() => ({
  placeholder: "What is new?",
  left: (n: number) => `${n} characters left`,
  over: (n: number) => `${n} characters too many`,
  image: "Add images",
  poll: "Add a poll",
  choice: (n: number) => `Choice ${n}`,
  addChoice: "Add a choice",
  removeImage: (n: number) => `Remove image ${n}`,
  post: "Post",
  ...pack(),
  ...props.labels,
}));
const uid = useId();
// characters as people count them: an emoji is one, not two
const used = computed(() => [...new Intl.Segmenter().segment(text.value)].length);
const left = computed(() => props.max - used.value);
const images = ref<{ file: File; url: string }[]>([]);
const poll = ref<string[] | undefined>();
const fileInput = ref<HTMLInputElement>();
function addImages(list: FileList | null) {
  for (const file of [...(list ?? [])].slice(0, props.maxImages - images.value.length)) {
    images.value.push({ file, url: URL.createObjectURL(file) });
  }
  if (fileInput.value) fileInput.value.value = "";
}
function removeImage(i: number) {
  URL.revokeObjectURL(images.value[i]!.url);
  images.value.splice(i, 1);
}
onBeforeUnmount(() => images.value.forEach((im) => URL.revokeObjectURL(im.url)));
const pollOk = computed(() => !poll.value || poll.value.filter((c) => c.trim()).length >= 2);
const canPost = computed(
  () => (used.value > 0 || images.value.length > 0) && left.value >= 0 && pollOk.value,
);
function post() {
  if (!canPost.value) return;
  emit("post", {
    text: text.value.trim(),
    images: images.value.map((im) => im.file),
    poll: poll.value?.map((c) => c.trim()).filter(Boolean),
  });
}
</script>

<template>
  <form class="bless-post" @submit.prevent="post">
    <div class="bless-post__main">
      <BlessAvatar v-if="author" :name="author.name" :src="author.avatar" alt="" size="md" />
      <textarea
        v-model="text"
        class="bless-post__text"
        rows="3"
        :aria-label="t.placeholder"
        :placeholder="t.placeholder"
        :aria-describedby="`${uid}-count`"
        :aria-invalid="left < 0 || undefined"
      />
    </div>
    <ul v-if="images.length" class="bless-post__images">
      <li v-for="(im, i) in images" :key="im.url" class="bless-post__image">
        <img :src="im.url" alt="" />
        <button
          type="button"
          class="bless-post__x"
          :aria-label="t.removeImage(i + 1)"
          @click="removeImage(i)"
        >
          ✕
        </button>
      </li>
    </ul>
    <fieldset v-if="poll" class="bless-post__poll">
      <legend class="bless-post__legend">{{ t.poll }}</legend>
      <input
        v-for="(_, i) in poll"
        :key="i"
        v-model="poll[i]"
        class="bless-post__choice"
        :aria-label="t.choice(i + 1)"
        :placeholder="t.choice(i + 1)"
        maxlength="40"
      />
      <button v-if="poll.length < 4" type="button" class="bless-post__link" @click="poll.push('')">
        + {{ t.addChoice }}
      </button>
    </fieldset>
    <div class="bless-post__bar">
      <label
        class="bless-post__tool"
        :class="{ 'is-off': images.length >= maxImages }"
        :title="t.image"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="bless-post__file"
          :disabled="images.length >= maxImages"
          @change="addImages(($event.target as HTMLInputElement).files)"
        />
        <span aria-hidden="true">🖼︎</span><span class="bless-sr">{{ t.image }}</span>
      </label>
      <button
        type="button"
        class="bless-post__tool"
        :aria-pressed="!!poll"
        :title="t.poll"
        @click="poll = poll ? undefined : ['', '']"
      >
        <span aria-hidden="true">☰</span><span class="bless-sr">{{ t.poll }}</span>
      </button>
      <span
        :id="`${uid}-count`"
        class="bless-post__count"
        :class="{ 'is-over': left < 0, 'is-near': left >= 0 && left <= 20 }"
      >
        {{ left < 0 ? t.over(-left) : t.left(left) }}
      </span>
      <BlessButton type="submit" size="sm" :disabled="!canPost">{{ t.post }}</BlessButton>
    </div>
  </form>
</template>

<style>
.bless-post {
  display: grid;
  gap: var(--bless-space-3);
  padding: var(--bless-space-3);
  border: var(--bless-border-width) solid var(--bless-color-border);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-post__main {
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-3);
}
.bless-post__text {
  flex: 1;
  min-inline-size: 0;
  padding: var(--bless-space-2);
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-md);
  resize: vertical;
}
.bless-post__text:focus-visible,
.bless-post__choice:focus-visible,
.bless-post__tool:focus-visible,
.bless-post__tool:has(:focus-visible),
.bless-post__x:focus-visible,
.bless-post__link:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-post__images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: var(--bless-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.bless-post__image {
  position: relative;
  aspect-ratio: 1;
  background: var(--bless-color-surface-2);
}
.bless-post__image img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
.bless-post__x {
  position: absolute;
  inset-block-start: 4px;
  inset-inline-end: 4px;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  border: 0;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.7);
  color: #fff;
  cursor: pointer;
}
.bless-post__poll {
  display: grid;
  gap: var(--bless-space-2);
  margin: 0;
  padding: var(--bless-space-3);
  border: var(--bless-border-width) dashed var(--bless-color-border);
}
.bless-post__legend {
  padding: 0 var(--bless-space-1);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
}
.bless-post__choice {
  min-block-size: 2.25rem;
  padding: 0 var(--bless-space-2);
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  color: inherit;
  font: inherit;
}
.bless-post__link {
  justify-self: start;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-xs);
  text-decoration: underline;
  cursor: pointer;
}
.bless-post__bar {
  display: flex;
  align-items: center;
  gap: var(--bless-space-2);
  padding-block-start: var(--bless-space-2);
  border-block-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-post__tool {
  position: relative;
  display: inline-grid;
  place-items: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--bless-text-md);
  cursor: pointer;
}
.bless-post__tool[aria-pressed="true"] {
  background: var(--bless-color-surface-2);
}
.bless-post__tool.is-off {
  opacity: 0.4;
  cursor: not-allowed;
}
.bless-post__file {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: inherit;
}
.bless-post__count {
  margin-inline-start: auto;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  font-variant-numeric: tabular-nums;
}
.bless-post__count.is-near {
  color: var(--bless-color-text);
  font-weight: var(--bless-font-weight-bold);
}
.bless-post__count.is-over {
  color: var(--bless-color-danger-text);
  font-weight: var(--bless-font-weight-bold);
}
</style>
