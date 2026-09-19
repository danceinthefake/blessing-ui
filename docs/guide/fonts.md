# Fonts

`--bless-font-sans` is

```
"Roboto", "Noto Sans JP", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", sans-serif
```

Weights used: 100 (watermark, light mode only), 300, 400, 700. Nothing is bundled — load them yourself:

```html
<link
  href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Noto+Sans+JP:400,700&display=swap"
  rel="stylesheet"
/>
```

Or self-host and point `--bless-font-sans` at your `@font-face` names. Without any of this the stack falls through to the system sans, which is fine for everything except the thin watermark.
