<script setup lang="ts">
// one group of BlessQueryBuilder, and its groups inside it; not exported
import { nextTick, ref } from "vue";
import BlessButton from "./BlessButton.vue";
import BlessInput from "./BlessInput.vue";
import BlessSelect from "./BlessSelect.vue";
import {
  isGroup,
  noValue,
  opKey,
  opsFor,
  type BlessQueryField,
  type BlessQueryGroup,
  type BlessQueryOp,
  type BlessQueryRule,
} from "./query";

defineOptions({ name: "BlessQueryGroup" });
const props = defineProps<{
  fields: BlessQueryField[];
  text: Record<string, string>;
  depth: number;
  maxDepth: number;
  disabled?: boolean;
}>();
const group = defineModel<BlessQueryGroup>({ required: true });
const emit = defineEmits<{ remove: [] }>();

const field = (name: string) => props.fields.find((f) => f.name === name);
const opText = (f: BlessQueryField | undefined, op: BlessQueryOp) => props.text[opKey(f, op)]!;

function setRules(rules: BlessQueryGroup["rules"]) {
  group.value = { ...group.value, rules };
}
function patch(i: number, p: Partial<BlessQueryRule>) {
  const r = { ...(group.value.rules[i] as BlessQueryRule), ...p };
  if (p.field !== undefined) {
    // a new field keeps the operator only when that field has it too
    const ops = opsFor(field(p.field));
    if (!ops.includes(r.op)) r.op = ops[0]!;
    r.value = "";
  }
  setRules(group.value.rules.map((x, j) => (j === i ? r : x)));
}
const fresh = (): BlessQueryRule => ({
  field: props.fields[0]?.name ?? "",
  op: opsFor(props.fields[0])[0]!,
  value: "",
});
const add = ref<{ $el: HTMLElement }>();
function remove(i: number) {
  setRules(group.value.rules.filter((_, j) => j !== i));
  // focus stays in the group: on its add button
  nextTick(() => add.value?.$el.focus());
}
</script>

<template>
  <div class="bless-query__group" role="group" :aria-label="text.group">
    <div class="bless-query__match">
      <BlessSelect
        :model-value="group.match"
        size="sm"
        :disabled
        :aria-label="text.match"
        :options="[
          { value: 'all', label: text.all },
          { value: 'any', label: text.any },
        ]"
        @update:model-value="group = { ...group, match: $event as 'all' | 'any' }"
      />
      <BlessButton
        v-if="depth > 1"
        variant="ghost"
        size="sm"
        :disabled
        class="bless-query__remove-group"
        @click="emit('remove')"
      >
        {{ text.removeGroup }}
      </BlessButton>
    </div>
    <ul class="bless-query__rules" role="list">
      <li v-for="(r, i) in group.rules" :key="i" class="bless-query__item">
        <BlessQueryGroup
          v-if="isGroup(r)"
          :model-value="r"
          :fields
          :text
          :depth="depth + 1"
          :max-depth
          :disabled
          @update:model-value="setRules(group.rules.map((x, j) => (j === i ? $event : x)))"
          @remove="remove(i)"
        />
        <div v-else class="bless-query__rule">
          <BlessSelect
            :model-value="r.field"
            size="sm"
            :disabled
            :aria-label="text.field"
            :options="fields.map((f) => ({ value: f.name, label: f.label }))"
            @update:model-value="patch(i, { field: String($event) })"
          />
          <BlessSelect
            :model-value="r.op"
            size="sm"
            :disabled
            :aria-label="text.op"
            :options="
              opsFor(field(r.field)).map((o) => ({ value: o, label: opText(field(r.field), o) }))
            "
            @update:model-value="patch(i, { op: $event as BlessQueryOp })"
          />
          <template v-if="!noValue(r.op)">
            <BlessSelect
              v-if="field(r.field)?.type === 'select'"
              :model-value="r.value"
              size="sm"
              :disabled
              :aria-label="text.value"
              :placeholder="text.value"
              :options="field(r.field)?.options ?? []"
              @update:model-value="patch(i, { value: String($event) })"
            />
            <BlessInput
              v-else
              :model-value="r.value"
              size="sm"
              :type="field(r.field)?.type ?? 'text'"
              :disabled
              :aria-label="text.value"
              @update:model-value="patch(i, { value: String($event) })"
            />
          </template>
          <BlessButton
            variant="ghost"
            size="sm"
            icon
            :disabled
            :aria-label="text.remove"
            class="bless-query__remove"
            @click="remove(i)"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </BlessButton>
        </div>
      </li>
    </ul>
    <div class="bless-query__actions">
      <BlessButton
        ref="add"
        variant="outline"
        size="sm"
        :disabled
        @click="setRules([...group.rules, fresh()])"
      >
        {{ text.addRule }}
      </BlessButton>
      <BlessButton
        v-if="depth < maxDepth"
        variant="ghost"
        size="sm"
        :disabled
        @click="setRules([...group.rules, { match: 'all', rules: [fresh()] }])"
      >
        {{ text.addGroup }}
      </BlessButton>
    </div>
  </div>
</template>
