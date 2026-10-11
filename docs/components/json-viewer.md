---
title: JsonViewer
---

<script setup>
import JsonViewerBasic from "../demos/JsonViewerBasic.vue";
</script>

# JsonViewer

<p class="bless-lead">Any value as an open-and-close tree</p>

Any value as a tree that people open and close: an API response, a store, a configuration object. Use it in developer tools and admin screens. It shows data and does not edit it. For a tree that you build yourself, use [Tree](./tree).

<Demo title="Basic">
  <JsonViewerBasic />
  <template #code>

<<< ../demos/JsonViewerBasic.vue

  </template>
</Demo>

- `value` can be any value. Objects show as `key: {3}` and arrays as `key: [3]`, with the count of children. Other values show on one line: `"text"`, `12`, `true`, `null`.
- `openDepth` sets how many levels below the root start open (default 1). `rootLabel` names the root line.
- `limit` caps the children shown per object or array (default 100). A longer one ends with a disabled line, "… 9900 more". Long strings are cut at 120 characters.
- A value that points back to one of its parents shows as `[circular]`. The viewer does not loop.
- It is a [Tree](./tree), so the keyboard works the same way: arrows move, → opens, ← closes. Name it for screen readers with `label`.
- `jsonToNodes` is exported if you want the nodes for your own Tree.

## Usage

```ts
import { BlessJsonViewer } from "blessing-ui";
```

## API

<PropsTable name="BlessJsonViewer" />
