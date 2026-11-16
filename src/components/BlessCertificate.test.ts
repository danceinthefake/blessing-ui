import { mount } from "@vue/test-utils";
import BlessCertificate from "./BlessCertificate.vue";

test("BlessCertificate: the lines in order, the signer, and the code", () => {
  const w = mount(BlessCertificate, {
    props: {
      name: "Ana Putri",
      course: "Home recording",
      date: "17 Nov 2026",
      issuer: "Studio School",
      signer: "Rina",
      signerRole: "Teacher",
      code: "SS-0042",
      verifyUrl: "example.com/v",
    },
  });
  expect(w.find("h2").text()).toBe("Certificate of completion");
  expect(
    w.findAll(".bless-cert__frame > div, .bless-cert__foot span").map((e) => e.text()),
  ).toEqual([
    "Studio School",
    "This certificate goes to",
    "Ana Putri",
    "for the completion of",
    "Home recording",
    "on 17 Nov 2026",
    "Rina",
    "Teacher",
    "Certificate ID SS-0042",
    "Make sure that it is real at example.com/v",
  ]);
});
