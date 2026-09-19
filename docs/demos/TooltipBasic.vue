<script setup lang="ts">
import { BlessButton, BlessTooltip } from "blessing-ui";
</script>

<template>
  <div class="row">
    <BlessTooltip text="Save (⌘S)"><BlessButton>hover me</BlessButton></BlessTooltip>
    <BlessTooltip text="Below" placement="bottom"
      ><BlessButton variant="outline">bottom</BlessButton></BlessTooltip
    >
    <BlessTooltip placement="right" :delay="0">
      <template #content><b>rich</b> content, no delay</template>
      <BlessButton variant="ghost">right</BlessButton>
    </BlessTooltip>
    <BlessTooltip text="focus me with Tab"><a href="#">a link</a></BlessTooltip>
  </div>
</template>
