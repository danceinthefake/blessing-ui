<script lang="ts">
import { reactive } from "vue";

export type BlessPackageManager = "pnpm" | "npm" | "yarn" | "bun";

/** The command of each package manager to add packages, run a script, or run a package once. */
export function managerCommand(
  pm: BlessPackageManager,
  kind: "install" | "run" | "exec",
  what: string,
  dev = false,
): string {
  if (kind === "install") {
    const add = { pnpm: "pnpm add", npm: "npm install", yarn: "yarn add", bun: "bun add" }[pm];
    return `${add}${dev ? " -D" : ""} ${what}`;
  }
  if (kind === "run")
    return `${{ pnpm: "pnpm", npm: "npm run", yarn: "yarn", bun: "bun run" }[pm]} ${what}`;
  return `${{ pnpm: "pnpm dlx", npm: "npx", yarn: "yarn dlx", bun: "bunx" }[pm]} ${what}`;
}

// one choice for each group, shared by every CodeTabs on the page
const chosen = reactive<Record<string, string>>({});
</script>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { readStore, writeStore } from "../composables/storage";
import BlessCodeBlock, { type BlessCodeFile } from "./BlessCodeBlock.vue";

defineOptions({ name: "BlessCodeTabs" });

const props = withDefaults(
  defineProps<{
    /** packages to add, for example `blessing-ui vue` */
    install?: string;
    /** add them as dev dependencies */
    dev?: boolean;
    /** a script of package.json to run, for example `dev` */
    run?: string;
    /** a package to run once, for example `nuxi init app` */
    exec?: string;
    /** your own tabs in place of the package managers */
    tabs?: BlessCodeFile[];
    managers?: BlessPackageManager[];
    /** tabs with the same group keep the same choice on the page and on the next visit */
    group?: string;
    label?: string;
  }>(),
  { managers: () => ["pnpm", "npm", "yarn", "bun"], group: "package-manager", label: "Command" },
);

const files = computed<BlessCodeFile[]>(() => {
  if (props.tabs?.length) return props.tabs;
  const [kind, what] = props.install
    ? (["install", props.install] as const)
    : props.run
      ? (["run", props.run] as const)
      : (["exec", props.exec ?? ""] as const);
  return props.managers.map((pm) => ({
    name: pm,
    code: managerCommand(pm, kind, what, props.dev),
    lang: "sh",
  }));
});
const key = computed(() => `bless-codetabs:${props.group}`);
// the stored choice is read after mount, so the server and the first client render agree
onMounted(() => {
  if (chosen[props.group] === undefined) {
    const saved = readStore(key.value);
    if (saved) chosen[props.group] = saved;
  }
});
const active = computed({
  get: () =>
    Math.max(
      0,
      files.value.findIndex((f) => f.name === chosen[props.group]),
    ),
  set: (i: number) => {
    const name = files.value[i]?.name;
    if (name === undefined) return;
    chosen[props.group] = name;
  },
});
watch(
  () => chosen[props.group],
  (v) => v !== undefined && writeStore(key.value, v),
);
</script>

<template>
  <BlessCodeBlock v-model:active="active" class="bless-codetabs" :files :label />
</template>
