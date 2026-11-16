<script setup lang="ts">
import { ref } from "vue";
import { BlessPostComposer, type BlessNewPost } from "blessing-ui";

const draft = ref("Episode 41 is out! We talk about home recording with a radio engineer 🎙️");
const posted = ref<BlessNewPost>();
</script>

<template>
  <BlessPostComposer
    v-model="draft"
    :author="{ name: 'Home Studio' }"
    style="max-width: 560px"
    @post="(p) => ((posted = p), (draft = ''))"
  />
  <p v-if="posted" style="margin-top: 12px">
    Posted: "{{ posted.text }}" with {{ posted.images.length }} images<template v-if="posted.poll">
      and a poll</template
    >.
  </p>
</template>
