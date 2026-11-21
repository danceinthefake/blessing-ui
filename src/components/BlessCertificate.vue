<template>
  <article class="bless-cert">
    <div class="bless-cert__frame">
      <div class="bless-cert__issuer">{{ issuer }}</div>
      <h2 class="bless-cert__title">{{ text.title }}</h2>
      <div class="bless-cert__line">{{ text.given }}</div>
      <div class="bless-cert__name">{{ name }}</div>
      <div class="bless-cert__line">{{ text.completed }}</div>
      <div class="bless-cert__course">{{ course }}</div>
      <div class="bless-cert__line">{{ text.on(date) }}</div>
      <footer class="bless-cert__foot">
        <div v-if="signer" class="bless-cert__sign">
          <span class="bless-cert__signer">{{ signer }}</span>
          <span v-if="signerRole">{{ signerRole }}</span>
        </div>
        <div v-if="code" class="bless-cert__code">
          <span>{{ text.code(code) }}</span>
          <span v-if="verifyUrl">{{ text.verify }} {{ verifyUrl }}</span>
        </div>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLabelPack } from "../composables/useLabels";

defineOptions({ name: "BlessCertificate" });
const pack = useLabelPack("BlessCertificate");

const props = defineProps<{
  /** the person who gets the certificate */
  name: string;
  course: string;
  /** the date of completion as text */
  date: string;
  issuer: string;
  signer?: string;
  signerRole?: string;
  /** a code that a reader can look up to make sure that the certificate is real */
  code?: string;
  verifyUrl?: string;
  labels?: Partial<{
    title: string;
    given: string;
    completed: string;
    on: (date: string) => string;
    code: (code: string) => string;
    verify: string;
  }>;
}>();

const text = computed(() => ({
  title: "Certificate of completion",
  given: "This certificate goes to",
  completed: "for the completion of",
  on: (d: string) => `on ${d}`,
  code: (c: string) => `Certificate ID ${c}`,
  verify: "Make sure that it is real at",
  ...pack(),
  ...props.labels,
}));
</script>

<style>
.bless-cert {
  container-type: inline-size;
  max-inline-size: 56rem;
  aspect-ratio: 297 / 210;
  padding: 2cqi;
  box-sizing: border-box;
  border: 0.6cqi solid var(--bless-color-text);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
  print-color-adjust: exact;
}
.bless-cert__frame {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 1.2cqi;
  block-size: 100%;
  padding: 3cqi;
  box-sizing: border-box;
  border: 0.25cqi solid var(--bless-color-accent);
  text-align: center;
}
.bless-cert__issuer {
  font-size: 2cqi;
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
/* two classes, so the heading styles of a host page do not win */
.bless-cert .bless-cert__title {
  margin: 0 0 1.5cqi;
  padding: 0;
  border: 0;
  font-size: 4.4cqi;
  line-height: 1.1;
}
.bless-cert__line {
  font-size: 1.8cqi;
}
.bless-cert__name {
  padding: 0 3cqi 0.6cqi;
  border-block-end: 0.2cqi solid var(--bless-color-text);
  font-size: 5.2cqi;
  font-weight: var(--bless-font-weight-bold);
  line-height: 1.15;
}
.bless-cert__course {
  font-size: 3cqi;
  font-weight: var(--bless-font-weight-bold);
}
.bless-cert__foot {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 4cqi;
  inline-size: 100%;
  margin-block-start: 2.5cqi;
  font-size: 1.5cqi;
}
.bless-cert__sign {
  display: grid;
  min-inline-size: 30%;
  padding-block-start: 0.6cqi;
  border-block-start: 0.15cqi solid var(--bless-color-text);
}
.bless-cert__signer {
  font-weight: var(--bless-font-weight-bold);
}
.bless-cert__code {
  display: grid;
  margin-inline-start: auto;
  text-align: end;
  font-variant-numeric: tabular-nums;
}
@media print {
  .bless-cert {
    max-inline-size: none;
    break-inside: avoid;
  }
}
.bless-cert {
  animation: bless-enter var(--bless-duration-enter) var(--bless-ease-soft);
}
</style>
