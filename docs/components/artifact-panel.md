---
title: Artifact panel
---

# Artifact panel

<p class="bless-lead">A side panel for a document that the model writes, with versions, a copy, and a download</p>

Shows the document or the code that an AI assistant makes, next to the chat, so the chat stays short and the work stays in one place.

<Demo title="Basic">
  <ArtifactPanelBasic />
  <template #code>

<<< ../demos/ArtifactPanelBasic.vue

  </template>
</Demo>

- `title` names the document. `versions` is the list of texts, oldest first. Each change from the model adds a version.
- `v-model:version` is the index in view. It shows the newest version until the person picks another with the arrows.
- `lang` shows the text as code in a [code block](./code-block). Without it, the text shows as a plain document.
- `writing` says that the model writes the newest version now. The download waits until it ends, and the body has `aria-busy`.
- Copy puts the text in the clipboard, and a status line says so. Download saves it as `filename`.
- The ✕ button emits `close`. The panel is a landmark with a name, such as "Document: Launch plan".
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessArtifactPanel } from "blessing-ui";
```

## API

<PropsTable name="BlessArtifactPanel" />

<script setup>
import ArtifactPanelBasic from "../demos/ArtifactPanelBasic.vue";
</script>
