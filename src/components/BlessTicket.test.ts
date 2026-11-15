import { mount } from "@vue/test-utils";
import BlessTicket from "./BlessTicket.vue";

const qr = [
  [true, false],
  [false, true],
];

test("BlessTicket: the event as a heading, the given fields in order, and the stub with the QR code", () => {
  const w = mount(BlessTicket, {
    props: {
      event: "Home Studio Live",
      subtitle: "Episode 50, recorded with an audience",
      date: "Sat 28 Nov 2026",
      time: "19:30",
      venue: "Kineforum, Jakarta",
      seat: "C5",
      code: "HSL-0050-C5",
      qr,
    },
  });
  expect(w.find("h3").text()).toBe("Home Studio Live");
  expect(w.findAll(".bless-ticket__fields > div").map((d) => d.text())).toEqual([
    "DateSat 28 Nov 2026",
    "Time19:30",
    "VenueKineforum, Jakarta",
    "SeatC5",
  ]);
  const code = w.findComponent({ name: "BlessQrCode" });
  expect(code.props("value")).toBe("Ticket code: HSL-0050-C5");
  expect(w.find(".bless-ticket__code code").text()).toBe("HSL-0050-C5");
});

test("BlessTicket: no stub without a code, and labels translate", () => {
  const w = mount(BlessTicket, { props: { event: "x", seat: "A1", labels: { seat: "Kursi" } } });
  expect(w.find(".bless-ticket__stub").exists()).toBe(false);
  expect(w.find("dt").text()).toBe("Kursi");
});
