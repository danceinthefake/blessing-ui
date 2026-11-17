<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import BlessAvatar from "./BlessAvatar.vue";
import BlessRelativeTime from "./BlessRelativeTime.vue";
import { toDate } from "./relativeTime";

defineOptions({ name: "BlessActivityFeed" });

export interface BlessActivity {
  id: string | number;
  /** the person who did it */
  actor: { name: string; avatar?: string };
  /** what they did, for example "merged" or "commented on" */
  action: string;
  /** the thing they did it to, for example "#42" */
  target?: string;
  /** a link for the target */
  href?: string;
  /** a Date, a timestamp in ms, or a date string */
  time: Date | number | string;
}

const props = defineProps<{
  events: BlessActivity[];
  /** language of the day names and the times, for example `id`. Default: English. */
  locale?: string;
  /** a fixed "now" for the day groups and the times */
  now?: Date | number;
}>();

// the server does not know the time zone or the day of the reader, so until mount the groups are UTC dates
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const fixed = computed(() => props.now !== undefined);

const dayKey = (d: Date, local: boolean) =>
  local
    ? Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    : Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
const groups = computed(() => {
  const local = mounted.value || fixed.value;
  const now = new Date(props.now ?? Date.now());
  const today = dayKey(now, local);
  const rel = new Intl.RelativeTimeFormat(props.locale ?? "en", { numeric: "auto" });
  const date = new Intl.DateTimeFormat(props.locale ?? "en", {
    dateStyle: "medium",
    timeZone: local ? undefined : "UTC",
  });
  const out: { key: number; title: string; events: BlessActivity[] }[] = [];
  const sorted = [...props.events].sort((a, b) => +toDate(b.time) - +toDate(a.time));
  for (const e of sorted) {
    const d = toDate(e.time);
    const key = dayKey(d, local);
    let g = out.at(-1);
    if (g?.key !== key) {
      const ago = Math.round((key - today) / 86_400_000);
      const title = local && ago >= -1 && ago <= 0 ? rel.format(ago, "day") : date.format(d);
      out.push((g = { key, title: title[0]!.toUpperCase() + title.slice(1), events: [] }));
    }
    g.events.push(e);
  }
  return out;
});
</script>

<template>
  <div class="bless-activity">
    <section v-for="g in groups" :key="g.key" class="bless-activity__day" :aria-label="g.title">
      <p class="bless-activity__date" aria-hidden="true">{{ g.title }}</p>
      <ol class="bless-stagger bless-activity__list">
        <li v-for="e in g.events" :key="e.id" class="bless-activity__item">
          <BlessAvatar :src="e.actor.avatar" :name="e.actor.name" alt="" size="sm" />
          <p class="bless-activity__text">
            <slot name="event" :event="e">
              <strong>{{ e.actor.name }}</strong> {{ e.action }}
              <template v-if="e.target">
                <a v-if="e.href" :href="e.href" class="bless-activity__target">{{ e.target }}</a>
                <span v-else class="bless-activity__target">{{ e.target }}</span>
              </template>
            </slot>
          </p>
          <BlessRelativeTime
            class="bless-activity__time"
            :value="e.time"
            :locale
            :now
            format="short"
          />
        </li>
      </ol>
    </section>
  </div>
</template>

<style>
.bless-activity {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-4);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
}
.bless-activity__date {
  margin: 0 0 var(--bless-space-2);
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-activity__list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* a thin line joins the avatars of one day */
.bless-activity__list::before {
  content: "";
  position: absolute;
  inset-block: var(--bless-space-3);
  inset-inline-start: 15px;
  border-inline-start: var(--bless-border-width) solid var(--bless-color-border);
}
.bless-activity__item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--bless-space-3);
  padding-block: var(--bless-space-2);
}
.bless-activity__text {
  flex: 1;
  min-inline-size: 0;
  margin: 0;
  padding-block-start: 4px;
  line-height: 1.5;
}
.bless-activity__target {
  font-weight: var(--bless-font-weight-bold);
  color: var(--bless-color-text);
}
.bless-activity__time {
  flex: none;
  padding-block-start: 4px;
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
  white-space: nowrap;
}
</style>
