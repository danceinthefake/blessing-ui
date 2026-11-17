<script setup lang="ts">
import { ref } from "vue";
import { BlessField, BlessInput, BlessSavedForm, BlessTextarea } from "blessing-ui";

// type, wait a moment, then reload the page: the form offers your draft
const values = ref<Record<string, unknown>>({ business: "", city: "", activity: "" });
const sent = ref(false);
</script>

<template>
  <BlessSavedForm
    v-model="values"
    storage-key="demo-business-permit"
    @submit="sent = true"
    @later="sent = false"
  >
    <BlessField label="Name of the business">
      <BlessInput v-model="values.business as string" />
    </BlessField>
    <BlessField label="City">
      <BlessInput v-model="values.city as string" />
    </BlessField>
    <BlessField label="What does the business do?" description="Two or three sentences.">
      <BlessTextarea v-model="values.activity as string" />
    </BlessField>
  </BlessSavedForm>
  <div v-if="sent" style="margin-top: 12px">Sent. The draft is gone.</div>
</template>
