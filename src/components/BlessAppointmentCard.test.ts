import { mount } from "@vue/test-utils";
import BlessAppointmentCard from "./BlessAppointmentCard.vue";

const base = {
  title: "Check-up",
  date: "2026-11-20",
  time: "09:30–10:00",
  person: { name: "Dr. Sari", role: "GP" },
};

test("BlessAppointmentCard: date block, full date for screen readers, person, place, status, and actions", async () => {
  const w = mount(BlessAppointmentCard, { props: { ...base, place: "Klinik Sehat, Jakarta" } });
  expect(w.findAll(".bless-appt__date span").map((s) => s.text())).toEqual(["Nov", "20", "Fri"]);
  expect(w.find(".bless-appt__when").text()).toBe("Friday, November 20, 2026, 09:30–10:00");
  expect(w.find(".bless-appt__role").text()).toBe("GP");
  expect(w.find(".bless-appt__place").text()).toContain("Klinik Sehat, Jakarta");
  expect(w.find(".bless-appt__status").text()).toBe("✓ Confirmed");
  const buttons = w.findAll(".bless-appt__actions button");
  expect(buttons.map((b) => b.text())).toEqual(["Reschedule", "Cancel"]);
  await buttons[1]!.trigger("click");
  expect(w.emitted("cancel")).toHaveLength(1);
});

test("BlessAppointmentCard: a video call can be joined, and a cancelled visit has no actions", async () => {
  const v = mount(BlessAppointmentCard, { props: { ...base, video: true } });
  expect(v.find(".bless-appt__place").text()).toContain("Video call");
  await v.find(".bless-appt__actions button").trigger("click");
  expect(v.emitted("join")).toHaveLength(1);
  const c = mount(BlessAppointmentCard, { props: { ...base, status: "cancelled" } });
  expect(c.find(".bless-appt__status").text()).toBe("✕ Cancelled");
  expect(c.find(".bless-appt__actions").exists()).toBe(false);
});
