<script setup lang="ts">
import { computed } from "vue";
import meta from "../meta.json";

const props = defineProps<{ name: string }>();
type Row = {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
};
const m = computed(
  () =>
    (meta as Record<string, { props: Row[]; events: Row[]; slots: Row[]; exposed: Row[] }>)[
      props.name
    ],
);
const tidy = (t: string) => t.replace(/ \| undefined$/, "").replace(/\bundefined \| /g, "");
</script>

<template>
  <div v-if="m" class="props-table">
    <template v-if="m.props.length">
      <h4>Props</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in m.props" :key="p.name">
            <td>
              <code>{{ p.name }}</code
              ><span v-if="p.required" class="props-table__req">*</span>
            </td>
            <td>
              <code>{{ tidy(p.type) }}</code>
            </td>
            <td>
              <code v-if="p.default">{{ p.default }}</code
              ><span v-else>—</span>
            </td>
            <td>{{ p.description }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="m.events.length">
      <h4>Events</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in m.events" :key="e.name">
            <td>
              <code>{{ e.name }}</code>
            </td>
            <td>
              <code>{{ tidy(e.type) }}</code>
            </td>
            <td>{{ e.description }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="m.slots.length">
      <h4>Slots</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Scope</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in m.slots" :key="s.name">
            <td>
              <code>{{ s.name }}</code>
            </td>
            <td>
              <code>{{ s.type === "{}" ? "—" : tidy(s.type) }}</code>
            </td>
            <td>{{ s.description }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="m.exposed.length">
      <h4>Exposed</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="x in m.exposed" :key="x.name">
            <td>
              <code>{{ x.name }}</code>
            </td>
            <td>
              <code>{{ tidy(x.type) }}</code>
            </td>
            <td>{{ x.description }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
  <p v-else>
    No metadata for <code>{{ name }}</code> — run <code>pnpm docs:meta</code>.
  </p>
</template>

<style>
.props-table h4 {
  margin: 24px 0 8px;
  font-size: var(--bless-text-xs);
  letter-spacing: var(--bless-tracking-wider);
  text-transform: uppercase;
  color: var(--bless-color-text-muted);
}
.props-table table {
  display: table;
  width: 100%;
  font-size: var(--bless-text-sm);
}
.props-table td:nth-child(2) code {
  white-space: pre-wrap;
}
.props-table__req {
  color: var(--bless-color-danger);
}
</style>
