<script setup lang="ts">
import { ref } from "vue";
import { BlessRating } from "blessing-ui";
const stars = ref(3);
const love = ref(2);
</script>

<template>
  <div class="row">
    <BlessRating v-model="stars" label="Episode rating" />
    <BlessRating :model-value="4" readonly size="sm" />
    <BlessRating v-model="love" size="lg" icon="♥" :max="3" label="Favourite" />
    <BlessRating :model-value="1" disabled />
    <small>{{ stars }} / 5 · click the current star to clear</small>
  </div>
</template>
