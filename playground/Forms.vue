<script setup lang="ts">
import { ref } from "vue";
import { BlessInput, BlessLabel, BlessSeparator, BlessTextarea } from "blessing-ui";

const name = ref("");
const mail = ref("bad@");
const bio = ref("");
</script>

<template>
  <main class="pg">
    <h1>Blessing UI — forms</h1>
    <p><a href="/">← components</a> · <a href="/stage.html">stage</a></p>

    <section>
      <h2>BlessSeparator</h2>
      <BlessSeparator />
      <div class="row" style="height: 40px; align-items: stretch; margin-top: var(--bless-space-4)">
        <span>left</span><BlessSeparator orientation="vertical" color="rule" /><span>right</span>
      </div>
      <BlessSeparator label="or" color="accent" />
    </section>

    <section>
      <h2>BlessLabel + BlessInput</h2>
      <div class="row">
        <div class="col">
          <BlessLabel for="name" required>Name</BlessLabel>
          <BlessInput
            id="name"
            v-model="name"
            placeholder="加藤恵"
            description="as shown on the credits"
          />
        </div>
        <div class="col">
          <BlessLabel for="mail" hint="we never spam">Email</BlessLabel>
          <BlessInput
            id="mail"
            v-model="mail"
            type="email"
            :error="mail.includes('@') && mail.split('@')[1] ? '' : 'Enter a valid address'"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <BlessInput size="sm" placeholder="sm"><template #prefix>¥</template></BlessInput>
        </div>
        <div class="col">
          <BlessInput placeholder="md" type="search"><template #suffix>⌘K</template></BlessInput>
        </div>
        <div class="col"><BlessInput size="lg" placeholder="lg" /></div>
      </div>
      <div class="row">
        <div class="col"><BlessInput model-value="disabled" disabled /></div>
        <div class="col"><BlessInput model-value="readonly" readonly /></div>
        <div class="col"><BlessInput type="number" model-value="25" /></div>
      </div>
    </section>

    <section>
      <h2>BlessTextarea</h2>
      <div class="row">
        <div class="col">
          <BlessLabel for="bio">Bio</BlessLabel>
          <BlessTextarea
            id="bio"
            v-model="bio"
            placeholder="autogrow, max 120"
            :maxlength="120"
            counter
          />
        </div>
        <div class="col">
          <BlessLabel>Fixed rows</BlessLabel>
          <BlessTextarea :rows="4" :autogrow="false" error="Required" />
        </div>
      </div>
    </section>
  </main>
</template>
