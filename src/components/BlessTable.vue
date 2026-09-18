<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { BlessColumn } from "./table";

defineOptions({ name: "BlessTable" });

withDefaults(
  defineProps<{
    columns: BlessColumn<T>[];
    rows: T[];
    rowKey?: keyof T & string;
    caption?: string;
    /** stack rows into label/value pairs under 800px */
    stack?: boolean;
    striped?: boolean;
  }>(),
  { stack: true, striped: false },
);
</script>

<template>
  <table
    class="bless-table"
    :class="{ 'bless-table--stack': stack, 'bless-table--striped': striped }"
  >
    <caption v-if="caption || $slots.caption" class="bless-table__caption">
      <slot name="caption">{{ caption }}</slot>
    </caption>
    <thead class="bless-table__head">
      <tr>
        <th
          v-for="c in columns"
          :key="c.key"
          scope="col"
          class="bless-table__th"
          :class="c.align && `bless-table__cell--${c.align}`"
          :style="c.width ? { width: c.width } : undefined"
        >
          <slot name="head" :column="c">{{ c.label }}</slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="rowKey ? String(row[rowKey]) : i" class="bless-table__row">
        <component
          :is="c.header ? 'th' : 'td'"
          v-for="c in columns"
          :key="c.key"
          :scope="c.header ? 'row' : undefined"
          class="bless-table__cell"
          :class="c.align && `bless-table__cell--${c.align}`"
          :data-label="c.label"
        >
          <slot :name="`cell-${c.key}`" :row :value="row[c.key]" :index="i">
            <slot name="cell" :row :column="c" :value="row[c.key]" :index="i">{{
              row[c.key]
            }}</slot>
          </slot>
        </component>
      </tr>
    </tbody>
    <tfoot v-if="$slots.foot">
      <slot name="foot" />
    </tfoot>
  </table>
</template>

<style>
.bless-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--bless-font-sans);
  font-size: var(--bless-text-md);
  color: var(--bless-color-text);
  line-height: var(--bless-leading-tight);
}
.bless-table__caption {
  padding: 0 0 var(--bless-space-3);
  text-align: left;
  font-size: var(--bless-text-sm);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.bless-table__th {
  padding: var(--bless-space-2) var(--bless-space-3);
  border-bottom: calc(2 * var(--bless-border-width)) solid var(--bless-color-rule);
  text-align: left;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  white-space: nowrap;
}
.bless-table__cell {
  padding: var(--bless-space-3);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  text-align: left;
  font-weight: var(--bless-font-weight-normal);
  vertical-align: top;
}
th.bless-table__cell {
  font-weight: var(--bless-font-weight-bold);
}
.bless-table__cell--center {
  text-align: center;
}
.bless-table__cell--right {
  text-align: right;
}
.bless-table--striped .bless-table__row:nth-child(even) {
  background: var(--bless-color-surface);
}

@media (max-width: 800px) {
  .bless-table--stack .bless-table__head {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
  .bless-table--stack .bless-table__row {
    display: block;
    padding: var(--bless-space-3) 0;
    border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  }
  .bless-table--stack .bless-table__cell {
    display: flex;
    gap: var(--bless-space-3);
    padding: var(--bless-space-1) 0;
    border: 0;
    text-align: left;
  }
  .bless-table--stack .bless-table__cell::before {
    content: attr(data-label);
    flex: 0 0 7em;
    font-size: var(--bless-text-xs);
    font-weight: var(--bless-font-weight-bold);
    letter-spacing: var(--bless-tracking-wide);
    text-transform: uppercase;
    color: var(--bless-color-text-muted);
  }
}
</style>
