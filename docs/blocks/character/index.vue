<script setup lang="ts">
import { onMounted, ref } from "vue";
import { BlessCard, BlessDash, BlessModal, BlessSection, BlessSkew, BlessText } from "blessing-ui";
import type { Character } from "./domain";
import { mockCharacterApi } from "./api";

const chars = ref<Character[]>([]);
onMounted(async () => (chars.value = await mockCharacterApi.list()));
// one modal per character, each addressable as #chara-<id>
const open = ref<Record<string, boolean>>({});
</script>

<template>
  <BlessSection title="Character" class="chara">
    <div class="chara__grid">
      <BlessCard
        v-for="c in chars"
        :key="c.id"
        :href="`#chara-${c.id}`"
        :label="c.role"
        class="chara__card"
      >
        <template #media>
          <div class="chara__art" :style="{ '--_c': c.color }" aria-hidden="true">
            <span>{{ c.name.at(-1) }}</span>
          </div>
        </template>
        <BlessText as="p" weight="bold">{{ c.name }}</BlessText>
        <BlessText as="p" size="xs" muted>CV: {{ c.cv }}</BlessText>
      </BlessCard>
    </div>
    <BlessModal
      v-for="c in chars"
      :key="c.id"
      v-model="open[c.id]"
      :hash="`chara-${c.id}`"
      size="lg"
      :title="c.name"
    >
      <div class="chara__profile">
        <div class="chara__art chara__art--lg" :style="{ '--_c': c.color }" aria-hidden="true">
          <span>{{ c.name.at(-1) }}</span>
        </div>
        <div>
          <BlessText as="p" size="xs" muted>{{ c.reading }}</BlessText>
          <BlessText as="p"
            ><BlessSkew color="text" label>{{ c.role }}</BlessSkew></BlessText
          >
          <BlessText as="p" size="sm" style="margin-top: 8px">{{ c.bio }}</BlessText>
          <BlessText as="p" size="sm" muted style="margin-top: 12px"
            >CV<BlessDash />{{ c.cv }}</BlessText
          >
        </div>
      </div>
    </BlessModal>
  </BlessSection>
</template>

<style scoped>
.chara {
  padding: var(--bless-space-8) var(--bless-space-6);
}
.chara__grid {
  display: grid;
  padding-top: var(--bless-space-3); /* card labels hang above the card edge */
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--bless-space-4);
}
.chara__art {
  display: grid;
  place-items: center;
  aspect-ratio: 3 / 4;
  background: linear-gradient(160deg, var(--_c), color-mix(in srgb, var(--_c) 55%, #000));
  color: #fff;
  font-size: var(--bless-text-display);
  font-weight: var(--bless-font-weight-thin);
  line-height: 1;
}
.chara__art--lg {
  flex: none;
  width: 140px;
}
.chara__profile {
  display: flex;
  gap: var(--bless-space-6);
  align-items: flex-start;
}
@media (max-width: 800px) {
  .chara__art--lg {
    flex: none;
    width: 140px;
  }
  .chara__profile {
    flex-direction: column;
  }
}
</style>
