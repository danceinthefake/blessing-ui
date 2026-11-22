<template>
  <div class="booking">
    <section
      v-if="bookingId"
      ref="panel"
      tabindex="-1"
      class="booking__done"
      aria-labelledby="booking-done"
    >
      <BlessText id="booking-done" as="h1" size="lg" weight="light">You are booked</BlessText>
      <BlessText as="p">Booking {{ bookingId }}. We sent the details to {{ email }}.</BlessText>
      <BlessAppointmentCard
        :title="chosen!.name"
        :date="date!"
        :time="`${time}–${end}`"
        :person="{ name: chosen!.person, role: 'Stylist' }"
        place="Studio Rambut, Jl. Braga 12, Bandung"
        status="confirmed"
        locale="en-ID"
        @reschedule="restart"
        @cancel="restart"
      />
    </section>
    <template v-else>
      <BlessText as="h1" size="lg" weight="light">Book a visit</BlessText>
      <BlessSteps v-model="step" :steps clickable label="Booking steps" />
      <section v-if="step === 0" ref="panel" tabindex="-1" class="booking__time" aria-label="Time">
        <BlessRadioGroup v-model="service" label="Service">
          <BlessRadio
            v-for="s in services"
            :key="s.id"
            :value="s.id"
            :description="`${s.minutes} min · ${money.format(s.price)} · with ${s.person}`"
            >{{ s.name }}</BlessRadio
          >
        </BlessRadioGroup>
        <div class="booking__when">
          <div>
            <BlessText as="h2" size="sm" weight="bold">Day</BlessText>
            <BlessCalendar
              v-model="date"
              :min="today"
              :disabled-dates="isClosed"
              :week-start="1"
              locale="en-ID"
            />
            <BlessText as="p" size="xs" muted>Closed on Sundays.</BlessText>
          </div>
          <div aria-live="polite">
            <BlessText as="h2" size="sm" weight="bold">Time</BlessText>
            <BlessText v-if="!date" as="p" size="sm" muted
              >Pick a day to see the free times.</BlessText
            >
            <BlessText v-else-if="loading" as="p" size="sm" muted
              >Loading the free times…</BlessText
            >
            <BlessSlotPicker v-else v-model="time" :slots locale="en-ID" />
          </div>
        </div>
        <BlessAlert v-if="problem" color="danger" class="booking__problem">{{
          problem
        }}</BlessAlert>
        <div class="booking__actions">
          <BlessButton @click="next">Continue</BlessButton>
        </div>
      </section>
      <section v-else ref="panel" tabindex="-1" aria-label="Details">
        <BlessText as="p" class="booking__summary">
          {{ chosen?.name }} with {{ chosen?.person }}, {{ day }}, {{ time }}–{{ end }}
        </BlessText>
        <BlessForm class="booking__form" @submit="onSubmit">
          <BlessField label="Name" required>
            <BlessInput v-model="name" name="name" required autocomplete="name" />
          </BlessField>
          <BlessField label="Email" required description="We send the booking here.">
            <BlessInput v-model="email" name="email" type="email" required autocomplete="email" />
          </BlessField>
          <BlessField label="Note for the stylist">
            <BlessTextarea v-model="note" name="note" :rows="3" :maxlength="300" counter />
          </BlessField>
          <div class="booking__actions">
            <BlessButton variant="outline" @click="step = 0">Back</BlessButton>
            <BlessButton type="submit" :loading="sending">Book</BlessButton>
          </div>
        </BlessForm>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import {
  BlessAlert,
  BlessAppointmentCard,
  BlessButton,
  BlessCalendar,
  BlessField,
  BlessForm,
  BlessInput,
  BlessRadio,
  BlessRadioGroup,
  BlessSlotPicker,
  BlessSteps,
  BlessText,
  BlessTextarea,
} from "blessing-ui";
import { mockBookingApi } from "./api";
import { steps, useBooking } from "./useBooking";

const today = "2026-11-22";
const {
  services,
  service,
  chosen,
  date,
  time,
  end,
  slots,
  loading,
  isClosed,
  step,
  problem,
  next,
  sending,
  bookingId,
  book,
  restart,
} = useBooking(mockBookingApi, today);
const money = new Intl.NumberFormat("en-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const day = computed(() =>
  date.value
    ? new Intl.DateTimeFormat("en-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      }).format(new Date(`${date.value}T00:00:00Z`))
    : "",
);

const name = ref("");
const email = ref("");
const note = ref("");
const onSubmit = () => book({ name: name.value, email: email.value, note: note.value });
// a new step or the confirmation replaces the panel: focus follows it
const panel = ref<HTMLElement>();
watch([step, bookingId], () => nextTick(() => panel.value?.focus()));
</script>

<style scoped>
.booking {
  display: grid;
  gap: var(--bless-space-6);
  align-content: start;
  max-width: 56rem;
  padding: var(--bless-space-8) var(--bless-space-6);
}
.booking section {
  display: grid;
  gap: var(--bless-space-6);
}
.booking section:focus {
  outline: none;
}
.booking__when {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--bless-space-8);
}
.booking__when > div {
  display: grid;
  gap: var(--bless-space-3);
  align-content: start;
}
.booking__summary {
  padding: var(--bless-space-3) var(--bless-space-4);
  border-inline-start: 2px solid var(--bless-color-text);
  background: var(--bless-color-surface);
}
.booking__form {
  display: grid;
  gap: var(--bless-space-4);
  max-width: 32rem;
}
.booking__actions {
  display: flex;
  gap: var(--bless-space-2);
}
.booking__done {
  justify-items: start;
  max-width: 32rem;
}
@media (max-width: 760px) {
  .booking {
    padding-inline: var(--bless-space-4);
  }
  .booking__when {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
