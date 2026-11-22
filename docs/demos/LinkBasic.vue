<template>
  <BlessText as="p">
    Read the <BlessLink href="/guide/install">install guide</BlessLink>, or the
    <BlessLink href="https://vuejs.org/guide/introduction.html" external>Vue guide</BlessLink>
    first.
  </BlessText>
  <BlessText as="p" size="sm" muted>
    Photo by a friend. <BlessLink href="/design/credits" muted>Credits</BlessLink>
  </BlessText>
</template>

<script setup lang="ts">
import { BlessLink, BlessText } from "blessing-ui";
</script>
