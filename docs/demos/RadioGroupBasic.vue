<script setup lang="ts">
import { ref } from "vue";
import { BlessRadio, BlessRadioGroup } from "blessing-ui";
const heroine = ref("megumi");
</script>

<template>
  <div class="row" style="align-items: flex-start">
    <BlessRadioGroup v-model="heroine" label="Main heroine">
      <BlessRadio value="megumi" description="the flat one">加藤恵</BlessRadio>
      <BlessRadio value="eriri">英梨々</BlessRadio>
      <BlessRadio value="utaha">詩羽</BlessRadio>
      <BlessRadio value="michiru" disabled>美智留</BlessRadio>
    </BlessRadioGroup>
    <BlessRadioGroup v-model="heroine" label="Horizontal" orientation="horizontal">
      <BlessRadio value="megumi">恵</BlessRadio>
      <BlessRadio value="eriri">英梨々</BlessRadio>
      <BlessRadio value="utaha">詩羽</BlessRadio>
    </BlessRadioGroup>
  </div>
</template>
