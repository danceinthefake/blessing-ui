---
title: CSV import
---

# CSV import

<p class="bless-lead">Read a CSV file, match its columns to your fields, and check the rows</p>

Brings records into an ERP or an admin panel from a spreadsheet. CSV (comma-separated values) is a text file with one record on each line. The file stays in the browser. Your app gets the rows and saves them.

<Demo title="Basic">
  <CsvImportBasic />
  <template #code>

<<< ../demos/CsvImportBasic.vue

  </template>
</Demo>

- `fields` is the list of your fields. Each field has a `key`, a `label`, and an optional `required`.
- The first line of the file is the header. Each field gets the column with the same name, without case, spaces, or marks. A menu for each field changes the match, or skips the field.
- The preview shows the first rows as your fields (default 5, set by `preview`). An empty required cell has a dashed red edge.
- If a required field has no column, an error names it, and the import is off. A row that misses a required value is skipped, and a line says how many.
- "Import" emits `import` with the good rows, as objects with your keys. The values are text.
- `loadText(csv)` loads CSV text, for example from a paste. Call it through a template ref.
- The parser follows RFC 4180. It reads quoted fields with commas, line breaks, and "" for a quote. The `parseCsv` function is exported.
- Change the words with `labels` or a [label pack](../guide/translating): `file`, `match`, `skip`, `required`, `previewTitle`, `empty`, and the functions `rows`, `missing`, `unmatched`, and `import`.

## Usage

```ts
import { BlessCsvImport } from "blessing-ui";
```

## API

<PropsTable name="BlessCsvImport" />

<script setup>
import CsvImportBasic from "../demos/CsvImportBasic.vue";
</script>
