<script setup lang="ts">
import { BlessCourseCard } from "blessing-ui";
import { art } from "./_data";
</script>

<template>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 16px"
  >
    <BlessCourseCard
      title="Home recording from zero"
      href="#home-recording"
      :image="art('🎙️', 'f3d9c4')"
      teacher="Rina Hartono"
      :lessons="18"
      duration="5 h 40 min"
      level="Beginner"
      :progress="35"
    />
    <BlessCourseCard
      title="Mixing vocals that sit in the track"
      href="#mixing-vocals"
      :image="art('🎚️', 'c9dcf2')"
      teacher="Dimas Pratama"
      :lessons="12"
      duration="3 h 15 min"
      level="Middle"
      :progress="100"
    />
    <BlessCourseCard
      title="Podcast editing in a day"
      href="#podcast-editing"
      :image="art('🎧', 'd7ecd0')"
      teacher="Sari Wulandari"
      :lessons="8"
      duration="2 h"
      level="Beginner"
    />
  </div>
</template>
