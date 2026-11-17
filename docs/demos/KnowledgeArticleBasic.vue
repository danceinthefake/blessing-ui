<script setup lang="ts">
import { BlessKnowledgeArticle } from "blessing-ui";

const sections = [
  {
    title: "Before you start",
    body: "You need your tax number (NPWP), the email address of your account, and your phone.\n\nIf you lost the phone, call the help line first. A new phone needs a check of your identity.",
  },
  {
    title: "Reset the password",
    body: "Open the sign-in page and choose Forgot password.\n\nType your tax number and your email address. We send a code to your phone. The code works for 10 minutes.\n\nType the code, then a new password of 12 characters or more.",
  },
  {
    title: "If the code does not come",
    body: "Wait 2 minutes, then ask for a new code. Make sure that your phone has signal and that it can get messages from short numbers.",
  },
];
const related = [
  { title: "Change the phone number of your account", href: "#phone" },
  { title: "Sign in with your identity card", href: "#ktp" },
];
</script>

<template>
  <BlessKnowledgeArticle
    title="Reset the password of your tax account"
    updated="3 November 2026"
    :sections
    :related
  />
</template>
