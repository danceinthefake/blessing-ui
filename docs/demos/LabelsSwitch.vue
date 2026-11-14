<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BlessCopyButton,
  BlessPoll,
  BlessButton,
  labelsId,
  provideLabels,
  type BlessLabelPack,
} from "blessing-ui";

const packs: Record<string, BlessLabelPack> = {
  en: {},
  es: {
    BlessCopyButton: { copy: "Copiar", copied: "Copiado", copiedLive: "Copiado al portapapeles" },
    BlessPoll: {
      vote: "Votar",
      yours: "tu voto",
      votes: (n: number) => `${n} ${n === 1 ? "voto" : "votos"}`,
    },
  },
  // the Indonesian pack ships with the library
  id: labelsId,
};
const lang = ref<"en" | "es" | "id">("es");
// a getter, so the words change the moment `lang` does
provideLabels(computed(() => packs[lang.value]));
</script>

<template>
  <div class="col">
    <div class="row">
      <BlessButton size="sm" :variant="lang === 'en' ? 'solid' : 'outline'" @click="lang = 'en'"
        >English</BlessButton
      >
      <BlessButton size="sm" :variant="lang === 'es' ? 'solid' : 'outline'" @click="lang = 'es'"
        >Español</BlessButton
      >
      <BlessButton size="sm" :variant="lang === 'id' ? 'solid' : 'outline'" @click="lang = 'id'"
        >Indonesia</BlessButton
      >
    </div>
    <BlessCopyButton value="npm install blessing-ui" />
    <BlessPoll
      question="Tabs or spaces?"
      closed
      :options="[
        { value: 'a', label: 'Tabs', votes: 12 },
        { value: 'b', label: 'Spaces', votes: 1 },
      ]"
    />
  </div>
</template>
