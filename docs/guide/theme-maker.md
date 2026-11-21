# Theme maker

Pick one petal color and give the palette a name. The page makes the other accent tokens from the petal and keeps the [accent contract](./tokens#color-pairs). The preview below uses the new palette and follows the light or dark theme of this site.

<ThemeMaker />

## Use the palette

1. Copy the CSS into a stylesheet that loads after `tokens.css`.
2. Set the attribute on `<html>`, for example `<html data-palette="mine">`.

The page makes six tokens and one dark-mode cut, as [Palettes](./palettes#tokens-each-palette-sets) describes:

- `accent` is the petal, darkened until white text on it reaches 4.5:1.
- `accent-text` is the petal, darkened until it reaches 4.5:1 on `bg` and `surface`.
- The dark `accent-text` is the petal, lightened until it reaches 4.5:1 on the dark `bg` and `surface`.
- `chart-1` is the petal, darkened until it reaches 3:1 on `bg` and `surface`.
- `accent-soft` and `accent-2` are lighter tints of the petal. If the petal is too pale to carry white text, it becomes `accent-soft` itself.
- `badge` is the same as `accent`.

The six built-in palettes come out of the same steps within one or two shades. Grays, type, and geometry do not change. To tune one value, edit it in the CSS.

`setPalette()` and `BlessPaletteToggle` know only the six built-in palettes. Set the attribute yourself for a palette of your own.

<script setup>
import ThemeMaker from "../demos/ThemeMaker.vue";
</script>
