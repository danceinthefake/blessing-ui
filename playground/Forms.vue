<script setup lang="ts">
import { ref } from "vue";
import {
  BlessCheckbox,
  BlessInput,
  BlessLabel,
  BlessRadio,
  BlessRadioGroup,
  BlessSelect,
  BlessSeparator,
  BlessSlider,
  BlessSwitch,
  BlessTextarea,
} from "blessing-ui";

const name = ref("");
const mail = ref("bad@");
const bio = ref("");
const agree = ref(false);
const picks = ref<string[]>(["eriri"]);
const heroine = ref("megumi");
const dark = ref(true);
const season = ref<string | undefined>();
const vol = ref(35);
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

    <section>
      <h2>BlessCheckbox</h2>
      <div class="col">
        <BlessCheckbox v-model="agree" description="required to continue"
          >I agree to the terms</BlessCheckbox
        >
        <BlessCheckbox :model-value="true" indeterminate>Indeterminate</BlessCheckbox>
        <BlessCheckbox :model-value="true" disabled>Disabled checked</BlessCheckbox>
        <BlessCheckbox :model-value="false" invalid>Invalid</BlessCheckbox>
        <div class="row" style="margin-top: var(--bless-space-2)">
          <BlessCheckbox
            v-for="h in ['megumi', 'eriri', 'utaha']"
            :key="h"
            v-model="picks"
            :value="h"
            >{{ h }}</BlessCheckbox
          >
        </div>
        <small>picks: {{ picks }}</small>
      </div>
    </section>

    <section>
      <h2>BlessRadioGroup</h2>
      <div class="row">
        <BlessRadioGroup v-model="heroine" label="Main heroine">
          <BlessRadio value="megumi" description="the flat one">加藤恵</BlessRadio>
          <BlessRadio value="eriri">英梨々</BlessRadio>
          <BlessRadio value="utaha">詩羽</BlessRadio>
          <BlessRadio value="michiru" disabled>美智留</BlessRadio>
        </BlessRadioGroup>
        <BlessRadioGroup v-model="heroine" label="Horizontal" orientation="horizontal">
          <BlessRadio value="megumi">恵</BlessRadio>
          <BlessRadio value="eriri">英梨々</BlessRadio>
          <BlessRadio value="utaha">詩羽</BlessRadio>
        </BlessRadioGroup>
      </div>
      <small>heroine: {{ heroine }}</small>
    </section>

    <section>
      <h2>BlessSwitch</h2>
      <div class="row">
        <BlessSwitch v-model="dark">Dark mode</BlessSwitch>
        <BlessSwitch size="sm" :model-value="false">Small</BlessSwitch>
        <BlessSwitch label-position="start" :model-value="true">Label first</BlessSwitch>
        <BlessSwitch disabled :model-value="true">Disabled</BlessSwitch>
      </div>
    </section>

    <section>
      <h2>BlessSelect (native)</h2>
      <div class="row">
        <div class="col">
          <BlessLabel for="season">Season</BlessLabel>
          <BlessSelect
            id="season"
            v-model="season"
            placeholder="Choose…"
            :options="[
              { value: 's1', label: '第一期 (2015)' },
              { value: 's2', label: '第二期 ♭ (2017)' },
              { label: 'Film', options: [{ value: 'fine', label: 'Fine (2019)' }] },
              { value: 's3', label: '第三期', disabled: true },
            ]"
            description="native select, styled"
          />
        </div>
        <div class="col">
          <BlessSelect size="sm" :options="[{ value: 1, label: 'sm' }]" :model-value="1" />
        </div>
        <div class="col">
          <BlessSelect
            size="lg"
            :options="[{ value: 1, label: 'lg' }]"
            :model-value="1"
            error="Pick one"
          />
        </div>
      </div>
    </section>

    <section>
      <h2>BlessSlider</h2>
      <div class="row">
        <div class="col">
          <BlessSlider v-model="vol" label="Volume" show-value :format="(v) => `${v}%`" />
        </div>
        <div class="col">
          <BlessSlider :model-value="3" :min="1" :max="5" label="Rating" show-value />
        </div>
        <div class="col"><BlessSlider :model-value="60" disabled /></div>
      </div>
    </section>
  </main>
</template>
