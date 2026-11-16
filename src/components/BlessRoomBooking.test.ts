import { mount } from "@vue/test-utils";
import BlessRoomBooking, { type BlessRoomSlot } from "./BlessRoomBooking.vue";

test("BlessRoomBooking: booked times span cells, picks extend in a room, a booking blocks the extension, and book", async () => {
  const w = mount(BlessRoomBooking, {
    props: {
      rooms: [
        { id: "a", name: "Kenanga", seats: 6 },
        { id: "b", name: "Melati" },
      ],
      bookings: [{ room: "a", start: "10:00", end: "11:00", title: "Weekly sync" }],
      from: 9,
      to: 12,
      "onUpdate:modelValue": (v: BlessRoomSlot | null) => w.setProps({ modelValue: v }),
    },
  });
  expect(w.findAll("thead th").map((t) => t.text())).toEqual(["Room", "09:00", "10:00", "11:00"]);
  const busy = w.find(".bless-rooms__busy");
  expect(busy.attributes("colspan")).toBe("2");
  expect(busy.text()).toBe("Weekly sync10:00–11:00");
  expect(w.findAll("tbody tr")[0]!.findAll("td")).toHaveLength(5);
  const slot = (name: string) => w.find(`[aria-label="${name}"]`);
  await slot("Kenanga, 09:00, free").trigger("click");
  await slot("Kenanga, 11:00, free").trigger("click");
  expect(w.props("modelValue")).toEqual({ room: "a", start: "11:00", end: "11:30" });
  await slot("Melati, 09:30, free").trigger("click");
  await slot("Melati, 10:30, free").trigger("click");
  expect(w.find("[role=status]").text()).toBe("Melati, 09:30–11:00");
  expect(slot("Melati, 10:00, free").attributes("aria-pressed")).toBe("true");
  await w.find(".bless-rooms__book").trigger("click");
  expect(w.emitted("book")).toEqual([[{ room: "b", start: "09:30", end: "11:00" }]]);
});
