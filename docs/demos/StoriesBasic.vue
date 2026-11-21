<template>
  <BlessStories :people @seen="seen" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BlessStories, type BlessStoryPerson } from "blessing-ui";
import { art } from "./_data";

const people = ref<BlessStoryPerson[]>([
  {
    id: "studio",
    name: "Home Studio",
    stories: [
      {
        id: "s1",
        image: art("🎙️", "f3e1e7"),
        alt: "A microphone on a desk",
        caption: "Recording ep 42 today",
        time: "2 h",
      },
      {
        id: "s2",
        image: art("🎧", "dfe8f3"),
        alt: "Headphones on a stand",
        caption: "New headphones!",
        time: "1 h",
      },
    ],
  },
  {
    id: "ana",
    name: "Ana Putri",
    stories: [
      {
        id: "a1",
        image: art("✂️", "e8f3df"),
        alt: "A waveform on a screen",
        caption: "Editing late again",
        time: "5 h",
      },
    ],
  },
  {
    id: "budi",
    name: "Budi Santoso",
    seen: true,
    stories: [
      {
        id: "b1",
        image: art("🧱", "e6e6e6"),
        alt: "Foam panels on a wall",
        caption: "The room is done",
        time: "1 d",
      },
    ],
  },
]);
// a person is seen once the reader saw their last story
function seen(personId: string, storyId: string) {
  const p = people.value.find((x) => x.id === personId);
  if (p && p.stories.at(-1)?.id === storyId) p.seen = true;
}
</script>
