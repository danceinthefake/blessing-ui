<template>
  <div class="bless-camera" :class="`bless-camera--${state}`">
    <div v-if="state === 'live' || state === 'photo'" class="bless-camera__frame">
      <!-- the front camera shows as a mirror, as people expect; the photo itself is not mirrored -->
      <video
        v-show="state === 'live'"
        ref="video"
        class="bless-camera__video"
        :class="{ 'bless-camera__video--mirror': facing === 'user' }"
        :aria-label="text.preview"
        autoplay
        muted
        playsinline
      />
      <img v-if="state === 'photo'" class="bless-camera__photo" :src="url" :alt="text.photo" />
    </div>
    <div class="bless-camera__controls">
      <BlessButton v-if="state === 'idle' || state === 'unavailable'" @click="start">
        {{ text.start }}
      </BlessButton>
      <template v-else-if="state === 'live'">
        <BlessButton @click="capture">{{ text.capture }}</BlessButton>
        <BlessButton v-if="cameras > 1" variant="outline" @click="flip">
          {{ text.switch }}
        </BlessButton>
      </template>
      <BlessButton v-else variant="outline" @click="retake">{{ text.retake }}</BlessButton>
    </div>
    <p class="bless-camera__status" role="status">
      {{ state === "unavailable" ? text.unavailable : "" }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessButton from "./BlessButton.vue";

defineOptions({ name: "BlessCameraCapture" });
const pack = useLabelPack("BlessCameraCapture");

const props = withDefaults(
  defineProps<{
    /** the camera to start with: `user` faces the person, `environment` faces away */
    facing?: "user" | "environment";
    /** the image type of the photo */
    type?: string;
    /** 0 to 1, for `image/jpeg` and `image/webp` */
    quality?: number;
    labels?: Partial<{
      start: string;
      capture: string;
      switch: string;
      retake: string;
      preview: string;
      photo: string;
      unavailable: string;
    }>;
  }>(),
  { facing: "user", type: "image/jpeg", quality: 0.9 },
);
const emit = defineEmits<{
  /** the photo, as soon as it is taken */
  capture: [photo: Blob];
  /** no camera, no permission */
  error: [error: unknown];
}>();

const text = computed(() => ({
  start: "Start camera",
  capture: "Take photo",
  switch: "Switch camera",
  retake: "Retake",
  preview: "Camera preview",
  photo: "Photo",
  unavailable: "The camera is not available",
  ...pack(),
  ...props.labels,
}));

const state = ref<"idle" | "live" | "photo" | "unavailable">("idle");
const facing = ref(props.facing);
const cameras = ref(0);
const video = ref<HTMLVideoElement>();
const url = ref<string>();
let stream: MediaStream | undefined;

const release = () => {
  stream?.getTracks().forEach((t) => t.stop());
  stream = undefined;
};
async function start() {
  release();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing.value },
      audio: false,
    });
  } catch (e) {
    state.value = "unavailable";
    emit("error", e);
    return;
  }
  state.value = "live";
  await nextTick();
  if (video.value) {
    video.value.srcObject = stream;
    void video.value.play?.()?.catch(() => {});
  }
  // the labels and the count of cameras are known only after permission
  const devices = await navigator.mediaDevices.enumerateDevices?.().catch(() => []);
  cameras.value = (devices ?? []).filter((d) => d.kind === "videoinput").length;
}
function flip() {
  facing.value = facing.value === "user" ? "environment" : "user";
  void start();
}
function capture() {
  const v = video.value;
  if (!v) return;
  const c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  c.getContext("2d")?.drawImage(v, 0, 0);
  c.toBlob(
    (blob) => {
      if (!blob) return;
      release();
      url.value = URL.createObjectURL(blob);
      state.value = "photo";
      emit("capture", blob);
    },
    props.type,
    props.quality,
  );
}
function retake() {
  if (url.value) URL.revokeObjectURL(url.value);
  url.value = undefined;
  void start();
}
onBeforeUnmount(() => {
  release();
  if (url.value) URL.revokeObjectURL(url.value);
});
</script>

<style>
.bless-camera {
  display: grid;
  gap: var(--bless-space-2);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-camera__frame {
  display: grid;
  max-inline-size: 100%;
  background: var(--bless-color-media-bg);
}
.bless-camera__video,
.bless-camera__photo {
  display: block;
  inline-size: 100%;
  max-block-size: 70vh;
  object-fit: contain;
}
.bless-camera__video--mirror {
  transform: scaleX(-1);
}
.bless-camera__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--bless-space-2);
}
.bless-camera__status {
  margin: 0;
  font-size: var(--bless-text-sm);
  color: var(--bless-color-danger-text);
}
</style>
