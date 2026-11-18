import { config } from "@vue/test-utils";
import { defineComponent, h } from "vue";

// jsdom never ends a transition, so a real <TransitionGroup> keeps leaving items in the page.
// Render its real tag (a tbody, a ul) with the children at once, so tests see the shipped markup.
config.global.stubs = {
  ...config.global.stubs,
  "transition-group": defineComponent({
    props: { tag: { type: String, default: "span" } },
    setup:
      (props, { slots }) =>
      () =>
        h(props.tag, slots.default?.()),
  }),
};
