<script setup lang="ts">
import { BlessSection, BlessSeparator, BlessSkew, BlessText } from "blessing-ui";

const staff = [
  ["原作", "丸戸史明（富士見ファンタジア文庫刊）"],
  ["原作イラスト", "深崎暮人"],
  ["監督", "亀井幹太"],
  ["シリーズ構成", "丸戸史明"],
  ["キャラクターデザイン", "高瀬智章"],
  ["音楽", "羽岡佳"],
  ["アニメーション制作", "A-1 Pictures"],
];
const cast = [
  ["加藤恵", "安野希世乃"],
  ["澤村・スペンサー・英梨々", "大西沙織"],
  ["霞ヶ丘詩羽", "茅野愛衣"],
  ["氷堂美智留", "矢作紗友里"],
  ["波島出海", "赤﨑千夏"],
  ["安芸倫也", "松岡禎丞"],
];
</script>

<template>
  <BlessSection title="Staff & Cast" watermark="Staff" class="credits">
    <div class="credits__cols">
      <div>
        <BlessText as="h3" size="xs" weight="bold" tracking="wider" uppercase muted
          >Staff</BlessText
        >
        <dl class="credits__list">
          <template v-for="[role, name] in staff" :key="role">
            <dt>
              <BlessSkew color="text" label class="credits__role">{{ role }}</BlessSkew>
            </dt>
            <dd>{{ name }}</dd>
          </template>
        </dl>
      </div>
      <BlessSeparator orientation="vertical" class="credits__sep" />
      <div>
        <BlessText as="h3" size="xs" weight="bold" tracking="wider" uppercase muted>Cast</BlessText>
        <dl class="credits__list">
          <template v-for="[chara, actor] in cast" :key="chara">
            <dt>
              <BlessSkew color="accent" label class="credits__role">{{ chara }}</BlessSkew>
            </dt>
            <dd>{{ actor }}</dd>
          </template>
        </dl>
      </div>
    </div>
  </BlessSection>
</template>

<style scoped>
.credits {
  padding: var(--bless-space-8) var(--bless-space-6);
}
.credits__cols {
  display: flex;
  gap: var(--bless-space-8);
}
.credits__cols > div {
  flex: 1;
  min-width: 0;
}
.credits__list {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--bless-space-2) var(--bless-space-4);
  align-items: center;
  margin: var(--bless-space-3) 0 0;
}
.credits__list dd {
  margin: 0;
  font-size: var(--bless-text-sm);
}
.credits__role {
  white-space: nowrap;
}
.credits__sep {
  align-self: stretch;
}
@media (max-width: 800px) {
  .credits__cols {
    flex-direction: column;
  }
  .credits__sep {
    display: none;
  }
}
</style>
