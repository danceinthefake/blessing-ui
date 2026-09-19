<script setup lang="ts">
import { BlessKbd } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessKbd :keys="['⌘', 'K']" />
    <BlessKbd :keys="['Ctrl', 'Shift', 'P']" />
    <BlessKbd>Esc</BlessKbd>
    <span>press <BlessKbd :keys="['←']" /> / <BlessKbd :keys="['→']" /> in the gallery</span>
  </div>
</template>
