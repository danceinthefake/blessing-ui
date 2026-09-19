<script setup lang="ts">
import { ref } from "vue";
import { BlessInput } from "blessing-ui";
const name = ref("");
const mail = ref("bad@");
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <div class="col">
      <BlessInput v-model="name" placeholder="加藤恵" description="as shown on the credits" />
    </div>
    <div class="col">
      <BlessInput
        v-model="mail"
        type="email"
        :error="mail.includes('@') && mail.split('@')[1] ? '' : 'Enter a valid address'"
      />
    </div>
  </div>
</template>
