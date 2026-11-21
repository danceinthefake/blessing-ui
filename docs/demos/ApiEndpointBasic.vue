<template>
  <BlessApiEndpoint
    method="GET"
    path="/v1/orders/{id}"
    summary="Get one order"
    description="Returns the order with its state and total. Add expand to get the items or the customer in the same call."
    :params
    example="curl https://api.example.com/v1/orders/SO-2026-0417?expand=items \
  -H 'Authorization: Bearer sk_demo_42'"
    :responses
  />
</template>

<script setup lang="ts">
import { BlessApiEndpoint, type BlessApiParam, type BlessApiResponse } from "blessing-ui";

const params: BlessApiParam[] = [
  { name: "id", in: "path", type: "string", required: true, description: "The id of the order." },
  {
    name: "expand",
    in: "query",
    type: "string[]",
    description: "Add related records: items, customer.",
  },
  {
    name: "Authorization",
    in: "header",
    type: "string",
    required: true,
    description: "Bearer and your API key.",
  },
];
const responses: BlessApiResponse[] = [
  {
    status: 200,
    description: "The order.",
    body: JSON.stringify(
      { id: "SO-2026-0417", state: "paid", total: { amount: 1250000, currency: "IDR" }, items: 3 },
      null,
      2,
    ),
  },
  {
    status: 401,
    description: "The API key is missing or wrong.",
    body: '{ "error": "unauthorized" }',
  },
  { status: 404, description: "No order has this id.", body: '{ "error": "not_found" }' },
];
</script>
