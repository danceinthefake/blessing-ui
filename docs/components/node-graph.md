---
title: NodeGraph
---

<script setup>
import NodeGraphBasic from "../demos/NodeGraphBasic.vue";
</script>

# NodeGraph

<p class="bless-lead">Boxes you drag and link — a pipeline, a flow, a dependency map</p>

An editable diagram: nodes the reader places, and arrows they draw between them. Use it where the relationships are the content — a build pipeline, an automation, a lesson order. For a fixed hierarchy that is only displayed, use [OrgChart](./org-chart); for tasks on a calendar, [Gantt](./gantt). It sits on [InfiniteCanvas](./infinite-canvas), so the whole diagram pans and zooms.

<Demo title="Pipeline">
  <NodeGraphBasic />
  <template #code>

<<< ../demos/NodeGraphBasic.vue

  </template>
</Demo>

- Every node has one input (left) and one output (right). **Drag a node** to move it (`snap` keeps it on a grid); **pull from the output square onto another node** to link them. Click an arrow to select it and press **Delete** to remove it.
- Keyboard: focus a node (one is in the tab order), **arrows** move it (Shift: further), **L** starts a link — then **arrows** choose the target, **Enter** links (or unlinks, if they already are), **Esc** cancels — and **Delete** removes the node and its links. Each step is announced, and every node is named with what it connects to.
- `acyclic` refuses a link that would close a loop; self-links and duplicates are always refused, and the refusal is announced.
- The state is yours: `v-model:nodes` (`{ id, x, y, label }`), `v-model:edges` (`{ from, to }`), `v-model:selected` and `v-model:view`. `connect`, `disconnect`, `move` and `remove` events say what changed.
- Nodes are `nodeWidth` × `nodeHeight` (160 × 56) so links can find their ports; the `#node="{ node, selected }"` slot draws something richer inside that box. `:editable="false"` shows and selects but changes nothing.

## Usage

```ts
import { BlessNodeGraph } from "blessing-ui";
```

## API

<PropsTable name="BlessNodeGraph" />
