<template>
  <article class="bless-ticket">
    <div class="bless-ticket__main">
      <h3 class="bless-ticket__event">{{ event }}</h3>
      <p v-if="subtitle" class="bless-ticket__subtitle">{{ subtitle }}</p>
      <dl class="bless-ticket__fields">
        <div v-for="f in fields" :key="f.key" :class="`is-${f.key}`">
          <dt>{{ f.label }}</dt>
          <dd>{{ f.value }}</dd>
        </div>
      </dl>
    </div>
    <div v-if="qr || code" class="bless-ticket__stub">
      <BlessQrCode
        v-if="qr"
        :matrix="qr"
        :value="code ? `${text.code}: ${code}` : text.code"
        :size="112"
      />
      <p v-if="code" class="bless-ticket__code">
        <span class="bless-ticket__code-label">{{ text.code }}</span>
        <code>{{ code }}</code>
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";
import BlessQrCode from "./BlessQrCode.vue";

defineOptions({ name: "BlessTicket" });
const pack = useLabelPack("BlessTicket");

const props = defineProps<{
  /** the name of the event, as the heading */
  event: string;
  /** a short line under it, for example the name of the show */
  subtitle?: string;
  /** as text, for example "Sat 28 Nov 2026" */
  date?: string;
  time?: string;
  venue?: string;
  /** for example "C5" */
  seat?: string;
  holder?: string;
  /** the ticket code, shown under the QR code */
  code?: string;
  /** the QR modules of the code, for example `encode(code).data` from uqr */
  qr?: boolean[][];
  labels?: Partial<{
    date: string;
    time: string;
    venue: string;
    seat: string;
    holder: string;
    code: string;
  }>;
}>();

const text = computed(() => ({
  date: "Date",
  time: "Time",
  venue: "Venue",
  seat: "Seat",
  holder: "Name",
  code: "Ticket code",
  ...pack(),
  ...props.labels,
}));
const fields = computed(() =>
  (["date", "time", "venue", "seat", "holder"] as const)
    .filter((k) => props[k])
    .map((k) => ({ key: k, label: text.value[k], value: props[k]! })),
);
</script>

<style>
/* two parts joined by a tear line, with a notch at each end of it */
.bless-ticket {
  --_notch: 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  max-inline-size: 36rem;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-sm);
  color: var(--bless-color-text);
  -webkit-mask:
    radial-gradient(circle var(--_notch) at var(--_cut, calc(100% - 9.5rem)) 0, #0000 98%, #000)
      top / 100% 51% no-repeat,
    radial-gradient(circle var(--_notch) at var(--_cut, calc(100% - 9.5rem)) 100%, #0000 98%, #000)
      bottom / 100% 51% no-repeat;
  mask:
    radial-gradient(circle var(--_notch) at var(--_cut, calc(100% - 9.5rem)) 0, #0000 98%, #000)
      top / 100% 51% no-repeat,
    radial-gradient(circle var(--_notch) at var(--_cut, calc(100% - 9.5rem)) 100%, #0000 98%, #000)
      bottom / 100% 51% no-repeat;
}
.bless-ticket__main {
  display: flex;
  flex-direction: column;
  gap: var(--bless-space-2);
  padding: var(--bless-space-4);
  border-inline-start: 6px solid var(--bless-color-accent);
}
.bless-ticket__event {
  margin: 0;
  font-size: var(--bless-text-lg);
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.25;
}
.bless-ticket__subtitle {
  margin: 0;
  color: var(--bless-color-text-muted);
}
.bless-ticket__fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  gap: var(--bless-space-3);
  margin: var(--bless-space-2) 0 0;
}
.bless-ticket__fields .is-venue,
.bless-ticket__fields .is-holder {
  grid-column: span 2;
}
.bless-ticket__fields dt {
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  text-transform: var(--bless-label-case);
  color: var(--bless-color-text-muted);
}
.bless-ticket__fields dd {
  margin: 0;
  font-weight: var(--bless-font-weight-bold);
}
.bless-ticket__fields .is-seat dd {
  font-size: var(--bless-text-lg);
}
.bless-ticket__stub {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--bless-space-2);
  inline-size: 9.5rem;
  padding: var(--bless-space-3);
  border-inline-start: 2px dashed var(--bless-color-border);
  background: var(--bless-color-surface-2);
}
.bless-ticket__code {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}
.bless-ticket__code-label {
  font-size: var(--bless-text-xs);
}
.bless-ticket__code code {
  font-family: var(--bless-font-mono);
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wide);
  overflow-wrap: anywhere;
  text-align: center;
}
/* the stub is on the left in a right-to-left page */
[dir="rtl"] .bless-ticket {
  --_cut: 9.5rem;
}
/* on a narrow screen the stub goes under the main part, with no notches */
@media (max-width: 30rem) {
  .bless-ticket {
    grid-template-columns: 1fr;
    -webkit-mask: none;
    mask: none;
  }
  .bless-ticket__stub {
    inline-size: auto;
    border-inline-start: 0;
    border-block-start: 2px dashed var(--bless-color-border);
  }
}
.bless-ticket {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
