import { mount } from "@vue/test-utils";
import BlessDeployList, { type BlessDeploy } from "./BlessDeployList.vue";

const deploys: BlessDeploy[] = [
  { id: "3", state: "failed", env: "production", commit: "abcdef1234", time: "now" },
  {
    id: "2",
    state: "ready",
    env: "production",
    commit: "1234567890",
    message: "Fix",
    time: "1 h",
    live: true,
    url: "https://a",
  },
  { id: "1", state: "ready", env: "production", commit: "0000000aaa", time: "2 h" },
];

test("BlessDeployList: state in words, live, short hash, and actions by state", async () => {
  const w = mount(BlessDeployList, { props: { deploys } });
  const rows = w.findAll(".bless-deploys__row");
  expect(rows.map((r) => r.find(".bless-deploys__state").text())).toEqual([
    "✕ Failed",
    "● Ready",
    "● Ready",
  ]);
  expect(rows[1]!.find(".bless-deploys__env").text()).toBe("production Live");
  expect(rows[1]!.find("code").text()).toBe("1234567");
  expect(rows[1]!.find("a").attributes("href")).toBe("https://a");
  expect(rows[1]!.find("button").exists()).toBe(false);
  await rows[0]!.find("button").trigger("click");
  await rows[2]!.find("button").trigger("click");
  expect(w.emitted("redeploy")).toEqual([["3"]]);
  expect(w.emitted("rollback")).toEqual([["1"]]);
});
