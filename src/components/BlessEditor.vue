<script setup lang="ts">
// Structural stand-in for a Tiptap Editor so the shipped d.ts does not depend on @tiptap/*.
// Any object with chain().focus().<command>().run(), isActive() and can() fits — i.e. useEditor()'s value.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Chain = { run: () => boolean; [command: string]: (...args: any[]) => any };
export interface BlessEditorLike {
  chain: () => { focus: () => Chain };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isActive: (name: string, attrs?: any) => boolean;
  can: () => { undo: () => boolean; redo: () => boolean };
}
type Editor = BlessEditorLike;

defineOptions({ name: "BlessEditor" });

export type BlessEditorTool =
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "codeBlock"
  | "hr"
  | "undo"
  | "redo"
  | "|";

withDefaults(
  defineProps<{
    /** the Tiptap editor from useEditor(); the content goes in the default slot as <EditorContent :editor /> */
    editor: Editor | null | undefined;
    tools?: BlessEditorTool[];
    label?: string;
    disabled?: boolean;
    /** min height of the writing area */
    minHeight?: string;
  }>(),
  {
    tools: () => [
      "bold",
      "italic",
      "strike",
      "code",
      "|",
      "h1",
      "h2",
      "|",
      "bulletList",
      "orderedList",
      "blockquote",
      "codeBlock",
      "hr",
      "|",
      "undo",
      "redo",
    ],
    label: "Formatting",
    minHeight: "160px",
  },
);

type Def = {
  title: string;
  icon: string;
  run: (e: Editor) => unknown;
  active?: (e: Editor) => boolean;
  can?: (e: Editor) => boolean;
};
const c = (e: Editor) => e.chain().focus();
const defs: Record<Exclude<BlessEditorTool, "|">, Def> = {
  bold: {
    title: "Bold",
    icon: "B",
    run: (e) => c(e).toggleBold().run(),
    active: (e) => e.isActive("bold"),
  },
  italic: {
    title: "Italic",
    icon: "I",
    run: (e) => c(e).toggleItalic().run(),
    active: (e) => e.isActive("italic"),
  },
  strike: {
    title: "Strikethrough",
    icon: "S",
    run: (e) => c(e).toggleStrike().run(),
    active: (e) => e.isActive("strike"),
  },
  code: {
    title: "Inline code",
    icon: "‹›",
    run: (e) => c(e).toggleCode().run(),
    active: (e) => e.isActive("code"),
  },
  h1: {
    title: "Heading 1",
    icon: "H1",
    run: (e) => c(e).toggleHeading({ level: 1 }).run(),
    active: (e) => e.isActive("heading", { level: 1 }),
  },
  h2: {
    title: "Heading 2",
    icon: "H2",
    run: (e) => c(e).toggleHeading({ level: 2 }).run(),
    active: (e) => e.isActive("heading", { level: 2 }),
  },
  h3: {
    title: "Heading 3",
    icon: "H3",
    run: (e) => c(e).toggleHeading({ level: 3 }).run(),
    active: (e) => e.isActive("heading", { level: 3 }),
  },
  bulletList: {
    title: "Bullet list",
    icon: "•",
    run: (e) => c(e).toggleBulletList().run(),
    active: (e) => e.isActive("bulletList"),
  },
  orderedList: {
    title: "Numbered list",
    icon: "1.",
    run: (e) => c(e).toggleOrderedList().run(),
    active: (e) => e.isActive("orderedList"),
  },
  blockquote: {
    title: "Quote",
    icon: "❝",
    run: (e) => c(e).toggleBlockquote().run(),
    active: (e) => e.isActive("blockquote"),
  },
  codeBlock: {
    title: "Code block",
    icon: "{ }",
    run: (e) => c(e).toggleCodeBlock().run(),
    active: (e) => e.isActive("codeBlock"),
  },
  hr: { title: "Rule", icon: "―", run: (e) => c(e).setHorizontalRule().run() },
  undo: { title: "Undo", icon: "↶", run: (e) => c(e).undo().run(), can: (e) => e.can().undo() },
  redo: { title: "Redo", icon: "↷", run: (e) => c(e).redo().run(), can: (e) => e.can().redo() },
};
</script>

<template>
  <div
    class="bless-editor"
    :class="{ 'bless-editor--disabled': disabled }"
    :style="{ '--_min': minHeight }"
  >
    <div class="bless-editor__toolbar" role="toolbar" :aria-label="label">
      <slot name="toolbar" :editor>
        <template v-for="(t, i) in tools" :key="i">
          <span v-if="t === '|'" class="bless-editor__sep" aria-hidden="true" />
          <button
            v-else
            type="button"
            class="bless-editor__tool"
            :class="{ 'bless-editor__tool--on': editor && defs[t].active?.(editor) }"
            :title="defs[t].title"
            :aria-label="defs[t].title"
            :aria-pressed="defs[t].active ? !!(editor && defs[t].active(editor)) : undefined"
            :disabled="disabled || !editor || (defs[t].can ? !defs[t].can(editor) : false)"
            @mousedown.prevent
            @click="editor && defs[t].run(editor)"
          >
            <span aria-hidden="true">{{ defs[t].icon }}</span>
          </button>
        </template>
      </slot>
    </div>
    <div class="bless-editor__content"><slot /></div>
    <div v-if="$slots.footer" class="bless-editor__footer"><slot name="footer" :editor /></div>
  </div>
</template>

<style>
.bless-editor {
  display: flex;
  flex-direction: column;
  border: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-bg);
  font-family: var(--bless-font-sans);
  color: var(--bless-color-text);
}
.bless-editor:focus-within {
  border-color: var(--bless-color-text-muted);
}
.bless-editor__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: var(--bless-space-1);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
  background: var(--bless-color-surface);
}
.bless-editor__tool {
  display: inline-grid;
  place-items: center;
  min-width: 28px;
  height: 28px;
  padding: 0 var(--bless-space-1);
  border: var(--bless-border-width) solid transparent;
  background: transparent;
  color: var(--bless-color-text);
  font: inherit;
  font-size: var(--bless-text-xs);
  font-weight: var(--bless-font-weight-bold);
  cursor: pointer;
  transform: skewX(var(--bless-skew));
}
.bless-editor__tool > span {
  transform: skewX(var(--bless-skew-counter));
}
.bless-editor__tool:hover:not(:disabled) {
  background: var(--bless-color-bg);
}
.bless-editor__tool--on {
  background: var(--bless-color-text);
  color: var(--bless-color-on-text);
}
.bless-editor__tool:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.bless-editor__tool:focus-visible {
  outline: 2px solid var(--bless-color-accent);
  outline-offset: 1px;
}
.bless-editor__sep {
  width: var(--bless-border-width);
  height: 18px;
  margin: 0 var(--bless-space-1);
  background: var(--bless-color-border);
}
.bless-editor__content {
  flex: 1;
  padding: var(--bless-space-3) var(--bless-space-4);
}
/* ProseMirror surface — tokens only, no reset lib */
.bless-editor__content .tiptap,
.bless-editor__content .ProseMirror {
  min-height: var(--_min);
  outline: 0;
  font-size: var(--bless-text-md);
  line-height: var(--bless-leading-normal);
}
.bless-editor__content .tiptap > * + * {
  margin-top: var(--bless-space-2);
}
.bless-editor__content .tiptap > :first-child {
  margin-top: 0;
}
.bless-editor__content .tiptap :is(h1, h2, h3) {
  margin: var(--bless-space-4) 0 var(--bless-space-2);
  padding: 0;
  border: 0;
  font-weight: var(--bless-font-weight-light);
  letter-spacing: var(--bless-tracking-tight);
  line-height: var(--bless-leading-tight);
}
.bless-editor__content .tiptap h1 {
  font-size: var(--bless-text-xl);
}
.bless-editor__content .tiptap h2 {
  font-size: var(--bless-text-lg);
}
.bless-editor__content .tiptap :is(ul, ol) {
  margin: 0;
  padding-left: var(--bless-space-6);
}
.bless-editor__content .tiptap li {
  margin: 0;
  line-height: inherit;
}
.bless-editor__content .tiptap li + li {
  margin-top: var(--bless-space-1);
}
.bless-editor__content .tiptap p {
  margin: 0;
  line-height: inherit;
}
.bless-editor__content .tiptap blockquote {
  margin: 0;
  padding-left: var(--bless-space-3);
  border-left: 3px solid var(--bless-color-accent);
  color: var(--bless-color-text-muted);
}
.bless-editor__content .tiptap code {
  padding: 0 4px;
  background: var(--bless-color-surface);
  font-size: 0.9em;
}
.bless-editor__content .tiptap pre {
  padding: var(--bless-space-3);
  background: var(--bless-color-media-bg);
  color: #e8e9ea;
  overflow-x: auto;
}
.bless-editor__content .tiptap pre code {
  padding: 0;
  background: none;
}
.bless-editor__content .tiptap hr {
  border: 0;
  border-top: var(--bless-border-width) solid var(--bless-color-rule);
}
.bless-editor__content .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  color: var(--bless-color-text-muted);
  pointer-events: none;
}
.bless-editor__footer {
  padding: var(--bless-space-1) var(--bless-space-3);
  border-top: var(--bless-border-width) solid var(--bless-color-border);
  font-size: var(--bless-text-xs);
  color: var(--bless-color-text-muted);
}
.bless-editor--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
