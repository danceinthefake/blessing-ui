<template>
  <div class="dev">
    <BlessText as="h1" size="lg" weight="light">Developers</BlessText>
    <BlessText v-if="!loaded" as="p" muted>Loading…</BlessText>
    <BlessTabs v-else v-model="tab" :tabs label="Developer settings">
      <template #default="{ tab: t }">
        <div v-if="t.value === 'keys'" class="dev__panel">
          <BlessAlert v-if="fresh" color="success" title="Copy the key now">
            This is the only time we show all of {{ fresh }}. Keep it in a safe place, for example a
            secret store.
          </BlessAlert>
          <ul role="list" class="dev__keys">
            <li v-for="k in keys" :key="k.id" class="dev__key">
              <BlessApiKeyField
                :value="k.value"
                :name="k.name"
                :created="day(k.created)"
                :last-used="k.lastUsed ? day(k.lastUsed) : undefined"
                @regenerate="onRoll(k.id)"
              />
              <div class="dev__key-foot">
                <BlessText as="p" size="sm" muted>{{ scopeNames(k.scopes) }}</BlessText>
                <BlessButton size="sm" variant="ghost" color="danger" @click="revoking = k.id"
                  >Revoke</BlessButton
                >
              </div>
            </li>
          </ul>
          <BlessEmpty v-if="!keys.length" title="No API keys">
            Make a key for each app that calls the API.
          </BlessEmpty>
          <div><BlessButton @click="startKey">New key</BlessButton></div>
          <section class="dev__panel" aria-labelledby="dev-try">
            <BlessText id="dev-try" as="h2" size="md" weight="bold">Try it</BlessText>
            <BlessCodeTabs :tabs="samples" label="Language" />
          </section>
        </div>

        <div v-else-if="t.value === 'hooks'" class="dev__panel">
          <form class="dev__form" @submit.prevent="onSaveHook">
            <BlessField label="Address" :error="hookProblem">
              <BlessInput v-model="hook.url" type="url" placeholder="https://" />
            </BlessField>
            <BlessFieldset legend="Events">
              <div class="dev__checks">
                <BlessCheckbox
                  v-for="e in EVENTS"
                  :key="e.value"
                  v-model="hook.events"
                  :value="e.value"
                  :description="e.value"
                  >{{ e.label }}</BlessCheckbox
                >
              </div>
            </BlessFieldset>
            <div class="dev__actions">
              <BlessButton type="submit" :loading="busy">Save</BlessButton>
              <BlessButton variant="outline" :disabled="!webhook.events.length" @click="sendTest"
                >Send a test event</BlessButton
              >
            </div>
          </form>
          <BlessWebhookLog :deliveries :retrying @retry="redeliver" />
        </div>

        <BlessAuditLog v-else :entries="logShown" />
      </template>
    </BlessTabs>

    <BlessModal v-model="making" title="New API key" size="sm">
      <form class="dev__form" @submit.prevent="onCreate">
        <BlessField label="Name" :error="keyProblem">
          <BlessInput v-model="keyName" placeholder="For example: Accounting app" />
        </BlessField>
        <BlessFieldset legend="Scopes">
          <div class="dev__checks">
            <BlessCheckbox
              v-for="s in SCOPES"
              :key="s.value"
              v-model="keyScopes"
              :value="s.value"
              :description="s.value"
              >{{ s.label }}</BlessCheckbox
            >
          </div>
        </BlessFieldset>
        <div><BlessButton type="submit" :loading="busy">Make the key</BlessButton></div>
      </form>
    </BlessModal>
    <BlessAlertDialog
      :model-value="!!revoking"
      :title="`Revoke ${keys.find((k) => k.id === revoking)?.name}?`"
      description="Apps that use this key stop working at once. You cannot undo this."
      :labels="{ confirm: 'Revoke', cancel: 'Keep it' }"
      :loading="busy"
      @update:model-value="(v: boolean) => !v && (revoking = '')"
      @confirm="onRevoke"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import {
  BlessAlert,
  BlessAlertDialog,
  BlessApiKeyField,
  BlessAuditLog,
  BlessButton,
  BlessCheckbox,
  BlessCodeTabs,
  BlessEmpty,
  BlessField,
  BlessFieldset,
  BlessInput,
  BlessModal,
  BlessTabs,
  BlessText,
  BlessWebhookLog,
  useToast,
} from "blessing-ui";
import { mockDevelopersApi } from "./api";
import { EVENTS, SCOPES } from "./domain";
import { useDevelopers } from "./useDevelopers";

const {
  loaded,
  keys,
  webhook,
  deliveries,
  log,
  createKey,
  rollKey,
  revokeKey,
  saveWebhook,
  retrying,
  sendTest,
  redeliver,
} = useDevelopers(mockDevelopersApi, "You", () => new Date().toISOString());
const { toast } = useToast();

const tabs = [
  { value: "keys", label: "API keys" },
  { value: "hooks", label: "Webhooks" },
  { value: "log", label: "Log" },
];
const tab = ref("keys");

const day = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
const scopeNames = (scopes: string[]) => {
  const names = scopes.map((s) => SCOPES.find((x) => x.value === s)!.label.toLowerCase());
  return `Can ${new Intl.ListFormat("en-US").format(names)}`;
};
const logShown = computed(() =>
  log.value.map((e) => ({
    ...e,
    when: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(e.when),
    ),
  })),
);

const busy = ref(false);
async function run<T>(job: () => Promise<T>) {
  busy.value = true;
  try {
    return await job();
  } finally {
    busy.value = false;
  }
}

// keys
const making = ref(false);
const keyName = ref("");
const keyScopes = ref<string[]>([]);
const keyProblem = ref("");
const fresh = ref("");
function startKey() {
  keyName.value = "";
  keyScopes.value = ["orders:read"];
  keyProblem.value = "";
  making.value = true;
}
async function onCreate() {
  const r = await run(() => createKey(keyName.value, keyScopes.value));
  if (typeof r === "string") return (keyProblem.value = r);
  making.value = false;
  fresh.value = r.name;
}
async function onRoll(id: string) {
  await rollKey(id);
  fresh.value = keys.value.find((k) => k.id === id)!.name;
  toast({ title: "The old key stopped working", color: "success" });
}
const revoking = ref("");
async function onRevoke() {
  const name = keys.value.find((k) => k.id === revoking.value)?.name;
  await run(() => revokeKey(revoking.value));
  revoking.value = "";
  if (fresh.value === name) fresh.value = "";
  toast({ title: `${name} is revoked`, color: "success" });
}
// the samples read the key from the environment, so it never sits in code
const samples = [
  {
    name: "curl",
    lang: "sh",
    code: `curl https://api.tokosenja.example/v1/orders \\\n  -H "Authorization: Bearer $SHOP_API_KEY"`,
  },
  {
    name: "JavaScript",
    lang: "js",
    code: `const res = await fetch("https://api.tokosenja.example/v1/orders", {\n  headers: { Authorization: \`Bearer \${process.env.SHOP_API_KEY}\` },\n});\nconst orders = await res.json();`,
  },
];

// webhook
const hook = reactive({ url: "", events: [] as string[] });
watch(webhook, (w) => Object.assign(hook, { url: w.url, events: [...w.events] }), {
  immediate: true,
});
const hookProblem = ref("");
async function onSaveHook() {
  hookProblem.value = await run(() => saveWebhook({ url: hook.url, events: [...hook.events] }));
  if (!hookProblem.value) toast({ title: "The webhook is saved", color: "success" });
}
</script>

<style scoped>
.dev {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 48rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.dev__panel,
.dev__form {
  display: grid;
  gap: var(--bless-space-4);
  padding-top: var(--bless-space-4);
}
.dev__form {
  padding-top: 0;
}
.dev__checks {
  display: grid;
  gap: var(--bless-space-3);
}
.dev__keys {
  display: grid;
  gap: var(--bless-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.dev__key {
  display: grid;
  gap: var(--bless-space-2);
  padding-bottom: var(--bless-space-4);
  border-bottom: var(--bless-border-width) solid var(--bless-color-border);
}
.dev__key-foot,
.dev__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--bless-space-2);
}
.dev__actions {
  justify-content: start;
}
@media (max-width: 760px) {
  .dev {
    padding-inline: var(--bless-space-4);
  }
}
</style>
