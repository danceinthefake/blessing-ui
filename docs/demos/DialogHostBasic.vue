<script setup lang="ts">
import { defineComponent, h, ref } from "vue";
import { BlessButton, BlessInput, useDialog } from "blessing-ui";
// <BlessDialogHost /> is mounted once at the app root (this site does it in the theme layout)
const { open } = useDialog();
const result = ref<string>();

const RenameForm = defineComponent({
  props: { close: { type: Function, required: true }, current: String },
  setup(p) {
    const name = ref(p.current ?? "");
    return () => [
      h(BlessInput, {
        modelValue: name.value,
        "onUpdate:modelValue": (v: string | number) => (name.value = String(v)),
        placeholder: "new name",
        autofocus: true,
      }),
      h("div", { class: "row", style: "margin-top:12px;justify-content:flex-end" }, [
        h(
          BlessButton,
          { variant: "outline", size: "sm", onClick: () => p.close() },
          () => "Cancel",
        ),
        h(
          BlessButton,
          { color: "accent", size: "sm", onClick: () => p.close(name.value) },
          () => "Rename",
        ),
      ]),
    ];
  },
});

async function rename() {
  result.value = await open<string>({
    title: "Rename episode",
    component: RenameForm,
    props: { current: "第3話" },
    size: "sm",
  });
}
async function info() {
  await open({ title: "Heads up", text: "This modal was opened from code, no template needed." });
}
</script>

<template>
  <div class="row">
    <BlessButton @click="rename">Rename…</BlessButton>
    <BlessButton variant="outline" @click="info">Text only</BlessButton>
    <small>result: {{ result ?? "—" }}</small>
  </div>
</template>
