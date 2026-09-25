<script setup lang="ts">
import { BlessInput, BlessLabel } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessLabel for="d-name" required>Name</BlessLabel>
      <BlessInput id="d-name" placeholder="加藤恵" required />
    </div>
    <div class="col">
      <BlessLabel for="d-mail" hint="optional">Email</BlessLabel>
      <BlessInput id="d-mail" type="email" />
    </div>
  </div>
</template>
