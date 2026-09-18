<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAccordion,
  BlessAccordionItem,
  BlessBreadcrumb,
  BlessButton,
  BlessCheckbox,
  BlessCollapsible,
  BlessField,
  BlessForm,
  BlessInput,
  BlessLabel,
  BlessPagination,
  BlessRadio,
  BlessRadioGroup,
  BlessScrollArea,
  BlessSelect,
  BlessSeparator,
  BlessSlider,
  BlessSwitch,
  BlessTextarea,
  BlessToggle,
  BlessToggleGroup,
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
const faq = ref(false);
const align = ref<string | undefined>("left");
const fmt = ref<string[]>(["b"]);
const page = ref(7);
const result = ref("");
function onSubmit(d: FormData) {
  result.value = JSON.stringify(Object.fromEntries(d));
}
</script>

<template>
  <main class="pg">
    <h1>Blessing UI — forms</h1>
    <p><a href="/">← components</a> · <a href="/stage.html">stage</a></p>

    <section>
      <h2>Separator</h2>
      <BlessSeparator />
      <div class="row" style="height: 40px; align-items: stretch; margin-top: var(--bless-space-4)">
        <span>left</span><BlessSeparator orientation="vertical" color="rule" /><span>right</span>
      </div>
      <BlessSeparator label="or" color="accent" />
    </section>

    <section>
      <h2>Label + Input</h2>
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
      <h2>Textarea</h2>
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
      <h2>Checkbox</h2>
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
      <h2>RadioGroup</h2>
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
      <h2>Switch</h2>
      <div class="row">
        <BlessSwitch v-model="dark">Dark mode</BlessSwitch>
        <BlessSwitch size="sm" :model-value="false">Small</BlessSwitch>
        <BlessSwitch label-position="start" :model-value="true">Label first</BlessSwitch>
        <BlessSwitch disabled :model-value="true">Disabled</BlessSwitch>
      </div>
    </section>

    <section>
      <h2>Select (native)</h2>
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
      <h2>Slider</h2>
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

    <section>
      <h2>Collapsible + Accordion</h2>
      <div class="row">
        <div class="col">
          <BlessCollapsible v-model:open="faq" title="Standalone collapsible"
            >Native &lt;details&gt;; open = {{ faq }}</BlessCollapsible
          >
          <BlessCollapsible title="Disabled" disabled>hidden</BlessCollapsible>
        </div>
        <div class="col">
          <BlessAccordion>
            <BlessAccordionItem title="Single — 放送情報" :open="true"
              >TOKYO MX 木曜 24:00〜</BlessAccordionItem
            >
            <BlessAccordionItem title="Single — 配信">AbemaTV ほか</BlessAccordionItem>
            <BlessAccordionItem title="Single — Blu-ray">2019.09.25 発売</BlessAccordionItem>
          </BlessAccordion>
        </div>
        <div class="col">
          <BlessAccordion type="multiple">
            <BlessAccordionItem title="Multiple 1">any number open</BlessAccordionItem>
            <BlessAccordionItem title="Multiple 2">at once</BlessAccordionItem>
          </BlessAccordion>
        </div>
      </div>
    </section>

    <section>
      <h2>Toggle + ToggleGroup</h2>
      <div class="row" style="align-items: center">
        <BlessToggle>Bold</BlessToggle>
        <BlessToggle color="accent" :pressed="true">Pinned</BlessToggle>
        <BlessToggle size="sm" disabled>Off</BlessToggle>
        <BlessToggleGroup v-model="align" label="Align">
          <BlessToggle value="left">L</BlessToggle><BlessToggle value="center">C</BlessToggle
          ><BlessToggle value="right">R</BlessToggle>
        </BlessToggleGroup>
        <BlessToggleGroup v-model="fmt" type="multiple" label="Format">
          <BlessToggle value="b" color="accent">B</BlessToggle
          ><BlessToggle value="i" color="accent">I</BlessToggle
          ><BlessToggle value="u" color="accent">U</BlessToggle>
        </BlessToggleGroup>
        <small>align: {{ align }} · fmt: {{ fmt }}</small>
      </div>
    </section>

    <section>
      <h2>Breadcrumb</h2>
      <BlessBreadcrumb
        :items="[
          { label: 'Home', href: '#' },
          { label: 'News', href: '#' },
          { label: 'Blu-ray BOX 発売決定' },
        ]"
      />
      <BlessBreadcrumb
        separator="›"
        style="margin-top: var(--bless-space-2)"
        :items="[{ label: 'Character', href: '#' }, { label: '加藤恵' }]"
      />
    </section>

    <section>
      <h2>Pagination</h2>
      <div class="col" style="max-width: none">
        <BlessPagination v-model="page" :total="20" />
        <BlessPagination :model-value="1" :total="5" />
        <BlessPagination
          :model-value="3"
          :total="12"
          :siblings="2"
          :href="(p: number) => `#page-${p}`"
        />
        <small>page: {{ page }}</small>
      </div>
    </section>

    <section>
      <h2>ScrollArea</h2>
      <div class="row">
        <BlessScrollArea
          height="140px"
          width="320px"
          style="background: var(--bless-color-surface); padding: var(--bless-space-3)"
        >
          <p v-for="n in 12" :key="n" style="margin: 0 0 8px">
            第{{ n }}話 — vertical, thin scrollbar, faded edges
          </p>
        </BlessScrollArea>
        <BlessScrollArea
          axis="x"
          width="320px"
          style="background: var(--bless-color-surface); padding: var(--bless-space-3)"
        >
          <div style="display: flex; gap: 8px; width: max-content">
            <span v-for="n in 12" :key="n" style="padding: 8px 16px; background: #fff"
              >chip {{ n }}</span
            >
          </div>
        </BlessScrollArea>
      </div>
    </section>

    <section>
      <h2>Form + Field (Constraint API)</h2>
      <BlessForm style="max-width: 420px" @submit="onSubmit">
        <BlessField
          label="Handle"
          required
          description="3–12 chars"
          v-slot="{ id, error, describedby }"
        >
          <BlessInput
            :id
            name="handle"
            required
            minlength="3"
            maxlength="12"
            :invalid="!!error"
            :aria-describedby="describedby"
            placeholder="megumi"
          />
        </BlessField>
        <BlessField label="Email" required v-slot="{ id, error, describedby }">
          <BlessInput
            :id
            name="email"
            type="email"
            required
            :invalid="!!error"
            :aria-describedby="describedby"
            placeholder="you@example.com"
          />
        </BlessField>
        <BlessField label="Age" hint="optional" v-slot="{ id, error, describedby }">
          <BlessInput
            :id
            name="age"
            type="number"
            min="13"
            max="120"
            :invalid="!!error"
            :aria-describedby="describedby"
          />
        </BlessField>
        <BlessField label="Server says" error="Handle already taken" v-slot="{ id }">
          <BlessInput :id name="x" model-value="megumi" invalid />
        </BlessField>
        <div class="row">
          <BlessButton type="submit" color="accent">Submit</BlessButton
          ><BlessButton type="reset" variant="outline">Reset</BlessButton>
        </div>
        <small v-if="result">submitted: {{ result }}</small>
      </BlessForm>
    </section>
  </main>
</template>
