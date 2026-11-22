<template>
  <div class="pod">
    <header class="pod__head">
      <BlessText as="h1" size="lg" weight="light">Senja Shorts</BlessText>
      <BlessText as="p" muted
        >Three minutes on running a small shop, with Sari and Bayu. A new episode each
        Monday.</BlessText
      >
    </header>
    <div class="pod__body">
      <section class="pod__now" aria-labelledby="pod-now">
        <BlessText id="pod-now" as="h2" size="md" weight="bold">
          {{ current ? `${current.number}. ${current.title}` : "Loading…" }}
        </BlessText>
        <BlessAudioPlayer
          v-if="current && src"
          v-model:time="time"
          v-model:playing="playing"
          :tracks="[{ src, title: current.title, artist: 'Senja Shorts' }]"
          @pause="save"
        />
        <BlessTabs v-if="current" v-model="tab" :tabs label="Episode">
          <template #default="{ tab: t }">
            <BlessChapterList
              v-if="t.value === 'chapters'"
              :chapters
              :time
              :duration="current.seconds"
              @seek="onSeek"
            />
            <BlessTranscript v-else :cues :time class="pod__transcript" @seek="onSeek" />
          </template>
        </BlessTabs>
      </section>
      <BlessEpisodeList
        class="pod__list"
        :episodes="list"
        :current="playing ? current?.id : undefined"
        :labels="{ watched: 'Heard', length: (m) => `${m} min` }"
        @play="(id) => open(id, true)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  BlessAudioPlayer,
  BlessChapterList,
  BlessEpisodeList,
  BlessTabs,
  BlessText,
  BlessTranscript,
  type BlessEpisode,
} from "blessing-ui";
import { mockPodcastApi } from "./api";
import { usePodcast } from "./usePodcast";

const { episodes, current, src, time, playing, cues, chapters, open, save } =
  usePodcast(mockPodcastApi);

const tabs = [
  { value: "chapters", label: "Chapters" },
  { value: "transcript", label: "Transcript" },
];
const tab = ref("chapters");
const list = computed<BlessEpisode[]>(() =>
  episodes.value.map((e) => ({
    id: e.id,
    number: e.number,
    title: e.title,
    summary: e.summary,
    minutes: Math.round(e.seconds / 60),
    progress: e.heard / e.seconds,
  })),
);
function onSeek(s: number) {
  time.value = s;
  playing.value = true;
}
</script>

<style scoped>
.pod {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 64rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.pod__head,
.pod__now {
  display: grid;
  gap: var(--bless-space-3);
  align-content: start;
}
.pod__body {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: var(--bless-space-8);
  align-items: start;
}
.pod__transcript {
  --bless-transcript-height: 16rem;
}
@media (max-width: 760px) {
  .pod {
    padding-inline: var(--bless-space-4);
  }
  .pod__body {
    grid-template-columns: 1fr;
  }
}
</style>
