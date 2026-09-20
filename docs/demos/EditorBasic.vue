<script setup lang="ts">
import { BlessEditor } from "blessing-ui";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const editor = useEditor({
  extensions: [StarterKit],
  editorProps: { attributes: { "aria-label": "Script notes" } },
  content:
    "<h2>第3話 脚本メモ</h2><p>加藤恵は<strong>メインヒロイン</strong>。<em>フラグの立たない</em>出会いから始まる。</p><ul><li>冒頭：坂道</li><li>帽子が飛ぶ</li></ul>",
});
</script>

<template>
  <div style="max-width: 640px">
    <BlessEditor :editor>
      <EditorContent :editor />
      <template #footer="{ editor: e }"
        >{{ e?.storage.characterCount?.characters?.() ?? e?.getText().length }} chars</template
      >
    </BlessEditor>
  </div>
</template>
