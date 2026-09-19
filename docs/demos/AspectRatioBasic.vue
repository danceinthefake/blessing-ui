<script setup lang="ts">
import { BlessAspectRatio } from "blessing-ui";
import { shots } from "./_data";
</script>

<template>
  <div class="row">
    <BlessAspectRatio :ratio="16 / 9" style="width: 240px"
      ><img :src="shots[1].src" alt=""
    /></BlessAspectRatio>
    <BlessAspectRatio :ratio="1" style="width: 135px"
      ><img :src="shots[2].src" alt=""
    /></BlessAspectRatio>
    <BlessAspectRatio ratio="4 / 5" style="width: 108px"
      ><img :src="shots[3].src" alt=""
    /></BlessAspectRatio>
  </div>
</template>
