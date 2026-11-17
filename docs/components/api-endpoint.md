---
title: API endpoint
---

<script setup>
import ApiEndpointBasic from "../demos/ApiEndpointBasic.vue";
</script>

# API endpoint

<p class="bless-lead">One endpoint of an API with the method, the path, the parameters, and the responses</p>

Builds a page of API reference docs, one endpoint at a time.

<Demo title="Basic">
  <ApiEndpointBasic />
  <template #code>

<<< ../demos/ApiEndpointBasic.vue

  </template>
</Demo>

- `method` and `path` name the endpoint. Path parameters in braces, such as `{id}`, are underlined and in italics.
- `summary` is one line, and `description` is the longer text. Line breaks in it stay.
- `params` is the list of parameters. Each has a `name`, where it goes (`in`: path, query, header, or body), a `type`, and optional `required` and `description`. Each parameter says "required" or "optional" in words.
- `example` is a request in a [code block](./code-block) with a copy button. `example-lang` sets its language (default `sh`).
- `responses` is the list of answers. Each has a `status`, a `description`, and an example `body`. Each status gets a tab.
- Change the words with `labels` or a [label pack](../guide/translating). The API table lists the keys.

## Usage

```ts
import { BlessApiEndpoint } from "blessing-ui";
```

## API

<PropsTable name="BlessApiEndpoint" />
