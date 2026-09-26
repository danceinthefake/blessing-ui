---
title: Stage
---

# Stage

<p class="bless-lead">Page shell: fixed sidebar (22% / 200px inner) + content column (max 1300px) + footer. Collapses to an off-canvas drawer under 800px with focus trap and Esc.</p>

The page frame of an official site: a fixed sidebar beside the content on wide screens, a drawer behind a menu button on phones, and an optional background and footer. Use it once, at the root of a page.

`BlessStage` owns the viewport, so it can't sit inside a doc page:

[Open Stage on a page of its own ↗](/stage-example){target="_blank"}

<<< ../demos/StageFull.vue

- On phones the sidebar becomes a drawer: the menu button says whether it's open, opening moves focus into it, and Esc or the scrim closes it (Esc returns focus to the button). Closed, it is inert.
- `#sidebar`, the default slot (inside `<main>`), `#footer` and `#background`. `menuLabel` names the button.

## Usage

```ts
import { BlessStage, BlessSidebarNav } from "blessing-ui";
```

## API

<PropsTable name="BlessStage" />
