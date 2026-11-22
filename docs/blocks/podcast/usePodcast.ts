import { computed, onMounted, ref, watch } from "vue";
import type { PodcastApi } from "./api";
import { parseChapters, parseVtt, resumeAt, type Episode } from "./domain";

/** the episodes, the one in the player, and how far you listened to each */
export function usePodcast(api: PodcastApi) {
  const episodes = ref<Episode[]>([]);
  const currentId = ref("");
  const src = ref("");
  const time = ref(0);
  const playing = ref(false);
  const current = computed(() => episodes.value.find((e) => e.id === currentId.value));
  const cues = computed(() => (current.value ? parseVtt(current.value.transcript) : []));
  const chapters = computed(() => (current.value ? parseChapters(current.value.chapters) : []));

  // keep the place every 15 seconds, and at each pause or change of episode
  let saved = -1;
  const save = () => {
    const e = current.value;
    if (!e || Math.round(e.heard) === saved) return;
    saved = Math.round(e.heard);
    api.saveProgress(e.id, saved);
  };
  watch(time, (t) => {
    const e = current.value;
    if (!e) return;
    e.heard = Math.min(e.seconds, t);
    if (Math.abs(e.heard - saved) >= 15) save();
  });

  /** puts an episode in the player at the place where you stopped */
  async function open(id: string, play = false) {
    save();
    const url = await api.source(id);
    const e = episodes.value.find((x) => x.id === id)!;
    currentId.value = id;
    saved = Math.round(e.heard);
    src.value = url;
    time.value = resumeAt(e);
    if (play) playing.value = true;
  }

  onMounted(async () => {
    episodes.value = await api.episodes();
    // the newest episode that you did not finish
    const next = episodes.value.find((e) => resumeAt(e) > 0 || e.heard === 0);
    if (next) await open(next.id);
  });

  return { episodes, current, src, time, playing, cues, chapters, open, save };
}
