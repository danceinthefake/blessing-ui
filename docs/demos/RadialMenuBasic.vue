<script setup lang="ts">
import { ref } from "vue";
import { BlessRadialMenu } from "blessing-ui";

const items = [
  { id: "reply", label: "Reply", icon: "↩" },
  { id: "like", label: "Like", icon: "♥" },
  { id: "pin", label: "Pin", icon: "⚑" },
  { id: "delete", label: "Delete", icon: "✕", disabled: true },
  { id: "share", label: "Share", icon: "⇪" },
];
const last = ref("nothing yet");
</script>

<template>
  <div class="col" style="max-width: 420px">
    <BlessRadialMenu :items label="Message actions" @select="last = $event.label">
      <div
        tabindex="0"
        style="
          padding: 2.5rem 1rem;
          text-align: center;
          border: 1px dashed var(--bless-color-border);
        "
      >
        Right-click here, or touch and hold, or focus and press the menu key
      </div>
    </BlessRadialMenu>
    <small>chose: {{ last }}</small>
  </div>
</template>
