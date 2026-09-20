<script setup lang="ts">
import { ref } from "vue";
import {
  BlessButton,
  BlessDataTable,
  BlessListbox,
  BlessTreeTable,
  BlessCascadeSelect,
  BlessQuestionnaire,
  useTheme,
  useDialog,
  type BlessDataColumn,
  type BlessQuestion,
  type BlessCascadeOption,
} from "blessing-ui";
type Row = { id: number; name: string };
const rows: Row[] = [{ id: 1, name: "a" }];
const cols: BlessDataColumn<Row>[] = [{ key: "name", label: "Name", sortable: true }];
const pick = ref<string>();
const many = ref<string[]>([]);
const cas: BlessCascadeOption<string>[] = [
  { value: "a", label: "A", children: [{ value: "b", label: "B" }] },
];
const qs: BlessQuestion[] = [
  { name: "q", title: "?", type: "single", choices: [{ value: "x", label: "X" }] },
];
const { setPalette } = useTheme();
const { open } = useDialog();
setPalette("utaha");
open({ title: "t", text: "x" });
</script>
<template>
  <BlessButton color="accent" @click="() => {}">go</BlessButton>
  <BlessDataTable :rows :columns="cols" row-key="id" />
  <BlessListbox v-model="pick" :options="[{ value: 'a', label: 'A' }]" />
  <BlessListbox v-model="many" :options="[{ value: 'a', label: 'A' }]" multiple />
  <BlessTreeTable
    :rows="[{ id: 1, name: 'x' }]"
    row-key="id"
    :columns="[{ key: 'name', label: 'N' }]"
  />
  <BlessCascadeSelect v-model="pick" :options="cas" />
  <BlessQuestionnaire :questions="qs" />
</template>
