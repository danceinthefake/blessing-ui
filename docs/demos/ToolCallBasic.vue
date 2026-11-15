<script setup lang="ts">
import { ref } from "vue";
import { BlessButton, BlessStack, BlessToolCall } from "blessing-ui";

type Status = "running" | "done" | "error";
const search = ref<Status>("done");
const fetchPage = ref<Status>("error");
const write = ref<Status>("running");

function rerun() {
  write.value = "running";
  setTimeout(() => (write.value = "done"), 1500);
}
</script>

<template>
  <BlessStack :gap="2" style="max-width: 560px">
    <BlessToolCall
      name="search_web"
      summary="podcast episode titles"
      :status="search"
      :input="{ query: 'podcast episode titles', limit: 3 }"
      :output="[
        { title: 'How to name an episode', url: 'https://example.com/a' },
        { title: 'Titles that get clicks', url: 'https://example.com/b' },
      ]"
    />
    <BlessToolCall
      name="fetch_page"
      summary="example.com/c"
      :status="fetchPage"
      :input="{ url: 'https://example.com/c' }"
      output="Error 404: the page does not exist"
    />
    <BlessToolCall
      name="write_draft"
      summary="three titles"
      :status="write"
      :input="{ count: 3 }"
    />
    <BlessButton size="sm" variant="outline" style="align-self: start" @click="rerun"
      >Run again</BlessButton
    >
  </BlessStack>
</template>
