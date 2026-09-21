<script setup lang="ts">
import { BlessText } from "blessing-ui";
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessText as="p" size="xl" weight="thin">xl thin — 冴えない彼女の育てかた</BlessText>
    <BlessText as="p" size="lg">lg — TVアニメ公式サイト</BlessText>
    <BlessText as="p">md — body 本文テキスト</BlessText>
    <BlessText as="p" size="sm" muted>sm muted — 2019.09.25</BlessText>
    <BlessText as="p" size="xs" weight="bold" tracking="wider" uppercase
      >xs bold wider upper — label</BlessText
    >
    <BlessText as="p" size="2xs" muted>2xs caption — ©丸戸史明・深崎暮人</BlessText>
    <BlessText as="p" size="sm" color="accent"
      >accent as text — a link colour that passes</BlessText
    >
  </div>
</template>
