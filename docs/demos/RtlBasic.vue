<script setup lang="ts">
import { ref } from "vue";
import {
  BlessAlert,
  BlessBreadcrumb,
  BlessButton,
  BlessCard,
  BlessCheckbox,
  BlessInput,
  BlessList,
  BlessListItem,
  BlessSteps,
  BlessSwitch,
  BlessTabs,
  BlessText,
} from "blessing-ui";

const dir = ref<"rtl" | "ltr">("rtl");
const tab = ref("news");
const step = ref(1);
</script>

<template>
  <div class="row" style="margin-bottom: 16px">
    <BlessSwitch :model-value="dir === 'rtl'" @update:model-value="dir = $event ? 'rtl' : 'ltr'">
      dir="{{ dir }}"
    </BlessSwitch>
    <small>hover a control — it leans the other way</small>
  </div>
  <div :dir class="col" style="gap: 20px">
    <BlessBreadcrumb
      :items="[
        { label: 'الرئيسية', href: '#' },
        { label: 'الأخبار', href: '#' },
        { label: 'التفاصيل' },
      ]"
    />
    <BlessTabs
      v-model="tab"
      :tabs="[
        { value: 'news', label: 'الأخبار' },
        { value: 'onair', label: 'البث' },
        { value: 'story', label: 'القصة' },
      ]"
      label="Sections"
    />
    <BlessSteps
      v-model="step"
      :steps="[{ label: 'الحساب' }, { label: 'الفريق' }, { label: 'المظهر' }]"
      clickable
    />
    <BlessAlert color="accent" title="تنبيه"
      >النص يبدأ من اليمين؛ الحافة الملوّنة تتبعه.</BlessAlert
    >
    <BlessCard label="جديد">
      <BlessText as="p" weight="bold">صندوق بلو-راي</BlessText>
      <BlessText as="p" size="sm" muted>يصدر في 24 ديسمبر</BlessText>
    </BlessCard>
    <BlessList>
      <BlessListItem meta="2026.09.20" badge>الإعلان عن صندوق بلو-راي</BlessListItem>
      <BlessListItem meta="2026.09.01">فعالية خاصة</BlessListItem>
    </BlessList>
    <BlessInput placeholder="بحث" aria-label="بحث"><template #prefix>⌕</template></BlessInput>
    <div class="row">
      <BlessCheckbox :model-value="true">تذكرني</BlessCheckbox>
      <BlessButton>تسجيل الدخول</BlessButton>
      <BlessButton variant="outline">إلغاء</BlessButton>
    </div>
  </div>
</template>
