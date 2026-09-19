<script setup lang="ts">
import { BlessCommand, useToast } from "blessing-ui";
import { commands } from "./_commands";
const { toast } = useToast();
</script>

<template>
  <div style="max-width: 480px">
    <BlessCommand
      :items="commands"
      inline
      placeholder="Filter commands…"
      @select="toast($event.label)"
    />
  </div>
</template>
