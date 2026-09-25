<script setup lang="ts">
import {
  BlessAlert,
  BlessButton,
  BlessCheckbox,
  BlessField,
  BlessForm,
  BlessInput,
  BlessPasswordInput,
  BlessSeparator,
  BlessText,
} from "blessing-ui";
import { useSignIn } from "./useSignIn";

const { email, password, remember, busy, error, done, submit } = useSignIn();
</script>

<template>
  <div class="signin">
    <BlessText as="h1" size="lg" weight="light">Sign in</BlessText>
    <BlessText as="p" size="sm" muted class="signin__lead"
      >Use your Blessing Software account.</BlessText
    >
    <BlessAlert v-if="done" color="success" title="Signed in" :dismissible="false"
      >Redirecting…</BlessAlert
    >
    <BlessForm v-else @submit="submit">
      <BlessAlert
        v-if="error"
        color="danger"
        live="alert"
        :dismissible="false"
        class="signin__error"
        >{{ error }}</BlessAlert
      >
      <BlessField label="Email" required>
        <BlessInput
          v-model="email"
          type="email"
          required
          autocomplete="username"
          placeholder="megumi@example.com"
        />
      </BlessField>
      <BlessField label="Password" required>
        <BlessPasswordInput v-model="password" required autocomplete="current-password" />
      </BlessField>
      <div class="signin__row">
        <BlessCheckbox v-model="remember">Remember me</BlessCheckbox>
        <a href="#" class="signin__link">Forgot password?</a>
      </div>
      <BlessButton type="submit" color="accent" :loading="busy" block>Sign in</BlessButton>
      <BlessSeparator label="or" class="signin__sep" />
      <BlessButton variant="outline" block>Continue with GitHub</BlessButton>
      <BlessText as="p" size="xs" muted class="signin__foot"
        >No account? <a href="#">Create one</a></BlessText
      >
    </BlessForm>
  </div>
</template>

<style scoped>
.signin {
  max-width: 360px;
  margin: 0 auto;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.signin__lead {
  margin-bottom: var(--bless-space-6);
}
.signin__error {
  margin-bottom: var(--bless-space-4);
}
.signin :deep(.bless-field) {
  margin-bottom: var(--bless-space-4);
}
.signin__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--bless-space-6);
  font-size: var(--bless-text-sm);
}
.signin__link,
.signin__foot a {
  color: var(--bless-color-accent-text);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.signin__sep {
  margin: var(--bless-space-6) 0;
}
.signin__foot {
  margin-top: var(--bless-space-6);
  text-align: center;
}
</style>
