<script setup lang="ts">
import { BlessNavigationMenu, useToast } from "blessing-ui";
const { toast } = useToast();
const items = [
  { label: "Home", href: "#", active: true },
  {
    label: "Heroines",
    items: [
      { label: "加藤恵", href: "#megumi", description: "メインヒロイン" },
      { label: "英梨々", href: "#eriri", description: "幼馴染・イラスト担当" },
      { label: "詩羽", href: "#utaha", description: "先輩・シナリオ担当" },
      { label: "美智留", href: "#michiru", description: "従姉・音楽担当" },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Blu-ray & DVD", href: "#bd" },
      { label: "Music", href: "#music" },
      { label: "Books", href: "#books" },
    ],
  },
  { label: "News", href: "#news" },
];
</script>

<template>
  <BlessNavigationMenu
    :items
    @select="
      (i, e) => {
        e.preventDefault();
        toast(i.label);
      }
    "
  />
</template>
