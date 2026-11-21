<template>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px"
  >
    <BlessProductCard
      name="USB microphone, cardioid"
      href="#mic"
      :image="art('🎙️', 'f3e1e7')"
      :price="899000"
      :was="1299000"
      currency="IDR"
      locale="id-ID"
      :rating="4.6"
      :reviews="128"
      badge="Sale"
      @add="added.push('mic')"
    />
    <BlessProductCard
      name="Closed-back headphones"
      href="#headphones"
      :image="art('🎧', 'dfe8f3')"
      :price="650000"
      currency="IDR"
      locale="id-ID"
      :rating="4.3"
      :reviews="54"
      badge="New"
      @add="added.push('headphones')"
    />
    <BlessProductCard
      name="Foam panels, pack of 12"
      href="#foam"
      :image="art('🧱', 'e6e6e6')"
      :price="240000"
      currency="IDR"
      locale="id-ID"
      sold-out
    />
  </div>
  <p v-if="added.length" style="margin-top: 12px">In the cart: {{ added.join(", ") }}</p>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessProductCard } from "blessing-ui";
import { art } from "./_data";

const added = ref<string[]>([]);
</script>
