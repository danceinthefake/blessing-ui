<script setup lang="ts">
import { BlessCheckbox, BlessFieldset } from "blessing-ui";
</script>

<template>
  <div class="row" style="align-items: flex-start; flex-wrap: wrap">
    <BlessFieldset legend="Notifications" style="width: 260px">
      <div class="col">
        <BlessCheckbox :model-value="true">Email</BlessCheckbox><BlessCheckbox>Push</BlessCheckbox>
      </div>
    </BlessFieldset>
    <BlessFieldset legend="Advanced" toggleable :collapsed="true" style="width: 260px">
      <div class="col"><BlessCheckbox>Beta features</BlessCheckbox></div>
    </BlessFieldset>
    <BlessFieldset legend="Billing" disabled style="width: 260px">
      <div class="col">
        <BlessCheckbox :model-value="true">Invoices</BlessCheckbox
        ><BlessCheckbox>Receipts</BlessCheckbox>
      </div>
    </BlessFieldset>
  </div>
</template>
