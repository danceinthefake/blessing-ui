<template>
  <div class="col" style="max-width: none">
    <BlessAvatarGroup :items="cursors.map((c) => ({ name: c.name }))" size="sm" />
    <BlessPresenceCursors :cursors @move="me = $event">
      <div
        style="
          block-size: 220px;
          padding: 16px;
          border: 1px dashed var(--bless-color-rule);
          color: var(--bless-color-text-muted);
        "
      >
        Storyboard, scene 3. Move your pointer here.
      </div>
    </BlessPresenceCursors>
    <p style="margin: 0; font-size: 0.875rem">
      You: {{ me ? `${Math.round(me.x * 100)}%, ${Math.round(me.y * 100)}%` : "outside" }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { BlessAvatarGroup, BlessPresenceCursors, type BlessPresenceCursor } from "blessing-ui";

// two people who move on their own; in an app the positions come from the server
const cursors = ref<BlessPresenceCursor[]>([
  { id: "eriri", name: "Eriri", x: 0.2, y: 0.3 },
  { id: "utaha", name: "Utaha", x: 0.7, y: 0.6 },
]);
const me = ref<{ x: number; y: number } | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  let t = 0;
  timer = setInterval(() => {
    t += 0.15;
    cursors.value = [
      { id: "eriri", name: "Eriri", x: 0.3 + 0.2 * Math.cos(t), y: 0.4 + 0.25 * Math.sin(t) },
      { id: "utaha", name: "Utaha", x: 0.65 + 0.15 * Math.sin(t / 2), y: 0.55 + 0.2 * Math.cos(t) },
    ];
  }, 150);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
