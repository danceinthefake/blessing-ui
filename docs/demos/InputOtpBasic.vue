<script setup lang="ts">
import { ref } from "vue";
import { BlessInputOTP, useToast } from "blessing-ui";
const otp = ref("");
const bad = ref(false);
const { toast } = useToast();
function check(code: string) {
  bad.value = code !== "123456";
  toast(
    bad.value ? { title: "Wrong code", color: "danger" } : { title: "Verified", color: "success" },
  );
}
</script>

<template>
  <div class="col" style="max-width: none">
    <BlessInputOTP v-model="otp" :separators="[3]" :invalid="bad" @complete="check" />
    <small>code: {{ otp || "—" }} · try 123456 · paste works</small>
    <BlessInputOTP :length="4" :numeric="false" masked label="PIN" />
    <BlessInputOTP :length="4" model-value="42" disabled />
  </div>
</template>
