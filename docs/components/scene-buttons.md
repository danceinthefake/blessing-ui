---
title: Scene buttons
---

# Scene buttons

<p class="bless-lead">Buttons that set many devices at once, such as Night or Away</p>

A scene is a saved set of states for many devices. One tap starts it. For one device, use the [device tile](./device-tile).

<Demo title="Basic">
  <SceneButtonsBasic />
  <template #code>

<<< ../demos/SceneButtonsBasic.vue

  </template>
</Demo>

- `scenes` is a list of scenes. Each scene has an `id` and a `name`, and an optional `icon` and `description`.
- A click emits `run` with the id. Your app then sets the devices.
- `v-model` is the id of the scene that runs now. Its button is pressed and filled with the text color.
- After a click, a hidden status line says that the scene is on.
- Change the words with `labels` or a [label pack](../guide/translating): `title` and `started` (a function).

## Usage

```ts
import { BlessSceneButtons } from "blessing-ui";
```

## API

<PropsTable name="BlessSceneButtons" />

<script setup>
import SceneButtonsBasic from "../demos/SceneButtonsBasic.vue";
</script>
