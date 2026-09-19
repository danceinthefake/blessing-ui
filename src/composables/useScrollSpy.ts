import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

/**
 * Tracks which of the given sections is in view; `active` is its id.
 * Pass ids or a selector; the topmost intersecting section wins.
 */
export function useScrollSpy(
  targets: string[] | string,
  opts: { rootMargin?: string; root?: Ref<HTMLElement | undefined> } = {},
) {
  const active = ref<string | undefined>();
  let io: IntersectionObserver | undefined;
  const visible = new Map<string, number>();

  onMounted(() => {
    const els = Array.isArray(targets)
      ? targets.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
      : Array.from(document.querySelectorAll<HTMLElement>(targets));
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top);
          else visible.delete(e.target.id);
        }
        const top = [...visible.entries()].sort((a, b) => a[1] - b[1])[0];
        if (top) active.value = top[0];
      },
      { root: opts.root?.value, rootMargin: opts.rootMargin ?? "0px 0px -60% 0px" },
    );
    els.forEach((el) => io!.observe(el));
    active.value ??= els[0]?.id;
  });
  onBeforeUnmount(() => io?.disconnect());
  return { active };
}
