<template>
  <BlessRequestInspector
    method="POST"
    url="https://api.example.com/v1/carts/C-2291/checkout"
    :status="422"
    status-text="Unprocessable Content"
    :duration="183"
    :size="96"
    :request
    :response
  />
</template>

<script setup lang="ts">
import { BlessRequestInspector } from "blessing-ui";

const request = {
  headers: {
    "content-type": "application/json",
    authorization: "Bearer sk_demo_••••42",
    "user-agent": "studio-shop/2.4",
  },
  body: '{"items":[{"sku":"MIC-USB-01","quantity":2}],"coupon":"LAUNCH"}',
};
const response = {
  headers: {
    "content-type": "application/json; charset=utf-8",
    "x-request-id": "req_8c41a9e0",
    "cache-control": "no-store",
  },
  body: '{"error":"coupon_expired","message":"The coupon LAUNCH ended on 1 November."}',
};
</script>
