<script setup lang="ts">
import { BlessRelativeTime } from "blessing-ui";

// fixed dates keep the `datetime` attribute the same on the server and in the browser
const now = new Date("2026-10-12T12:00:00Z");
const at = (seconds: number) => new Date(+now - seconds * 1000);
</script>

<template>
  <ul style="margin: 0; padding: 0; list-style: none; display: grid; gap: 0.5rem">
    <li>Posted <BlessRelativeTime :value="at(45)" :now="now" /></li>
    <li>Edited <BlessRelativeTime :value="at(3 * 3600)" :now="now" /></li>
    <li>Replied <BlessRelativeTime :value="at(86400)" :now="now" /></li>
    <li>Due <BlessRelativeTime :value="new Date(+now + 3 * 86400000)" :now="now" /></li>
    <li>In German <BlessRelativeTime :value="at(7200)" :now="now" locale="de" /></li>
    <li>Short <BlessRelativeTime :value="at(7200)" :now="now" format="short" /></li>
    <li>
      Live, counted from the time now (hover for the full date):
      <BlessRelativeTime value="2026-01-15T08:00:00Z" />
    </li>
  </ul>
</template>
