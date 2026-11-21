<template>
  <div class="col">
    <div class="row">
      <BlessButton
        v-for="p in people"
        :key="p"
        size="sm"
        :variant="typing.includes(p) ? 'solid' : 'outline'"
        :aria-pressed="typing.includes(p)"
        @click="toggle(p)"
      >
        {{ p }}
      </BlessButton>
    </div>
    <BlessTypingIndicator :names="typing" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessTypingIndicator } from "blessing-ui";

const people = ["Eriri", "Utaha", "Megumi", "Michiru"];
const typing = ref<string[]>(["Eriri"]);
const toggle = (name: string) =>
  (typing.value = typing.value.includes(name)
    ? typing.value.filter((n) => n !== name)
    : [...typing.value, name]);
</script>
