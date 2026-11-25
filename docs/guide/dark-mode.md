# Moods & dark mode

Blessing UI has three time-of-day moods: **Daylight** (warm paper `#EDE6E1` and violet-black ink `#262228`), **Golden hour** (`data-theme="golden"`, warm amber paper), and **Night** (`data-theme="dark"`, violet night paper with a faint top edge on raised surfaces). In Night, the accent fill stays the same while its text cut (and danger/info text) lifts for contrast, and `--bless-font-weight-thin` shifts from 100 to 300 so thin display type stays legible. The full list of changes is in [Tokens → What flips](./tokens#what-flips-what-swaps).

Follows `prefers-color-scheme` by default (Daylight or Night). Force any mood with `data-theme` on `<html>`:

```html
<html data-theme="golden"></html>
<html data-theme="dark"></html>
```

`data-theme="light"` forces Daylight even on a dark OS. The library also sets `color-scheme`, so native controls, scrollbars, and form fields follow the mood.

<Demo title="The control">
  <ThemeToggleBasic />
  <template #code>

<<< ../demos/ThemeToggleBasic.vue

  </template>
</Demo>

`BlessThemeToggle` is the ready-made control. This site uses it in the top bar. By default it is a single sun/moon button. Use `mode="group"` for Daylight, System, Golden hour, and Night.

## `useTheme()`

```ts
import { useTheme } from "blessing-ui";
const { theme, isDark, set, toggle } = useTheme();
// theme: "light" | "dark" | "golden" | "system" — persisted in localStorage("bless-theme")
```

`toggle()` flips to the opposite of what is currently _shown_: from `system` on a dark OS it goes to `light`, so the first click always changes something. `set("golden")` selects Golden hour, and `set("system")` hands control back to the OS.

## No flash on load

`useTheme()` applies the persisted choice after the app mounts (after hydration, so server-rendered markup matches). On a static or server-rendered page that leaves one frame of the default mood before a saved preference lands. Set the attribute before paint with an inline script in `<head>`:

```html
<script>
  try {
    const t = localStorage.getItem("bless-theme");
    if (t === "dark" || t === "light" || t === "golden") document.documentElement.dataset.theme = t;
    const p = localStorage.getItem("bless-palette");
    if (p) document.documentElement.dataset.palette = p;
  } catch {}
</script>
```

Nuxt: `app.head.script: [{ innerHTML: "…", tagPosition: "head" }]` in `nuxt.config`. You need nothing else. You do not have to wrap components in `BlessClientOnly` for theming. Only the `aria-pressed` attribute of the toggle waits for the client, so the library sets it after hydration.

## Overriding the dark palette

Redefine the tokens under both selectors that `tokens.css` uses: the forced one and the one that follows the OS. Load the override **after** `tokens.css`:

```css
:root[data-theme="dark"] {
  --bless-color-surface: #1c1e22;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bless-color-surface: #1c1e22;
  }
}
```

<script setup>
import ThemeToggleBasic from "../demos/ThemeToggleBasic.vue";
</script>
