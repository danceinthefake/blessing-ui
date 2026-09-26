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
  const visible = new Set<HTMLElement>();

  onMounted(() => {
    const els = Array.isArray(targets)
      ? targets.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
      : Array.from(document.querySelectorAll<HTMLElement>(targets));
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target as HTMLElement);
          else visible.delete(e.target as HTMLElement);
        }
        // entries only carry the elements that changed; measure the rest now, not from a stale rect.
        // Nearest top edge wins, so a section that just scrolled past doesn't beat the one at the top.
        // measured from the scroll container's top when there is one, else the viewport's
        const edge = opts.root?.value?.getBoundingClientRect().top ?? 0;
        const dist = (el: HTMLElement) => Math.abs(el.getBoundingClientRect().top - edge);
        const top = [...visible].sort((a, b) => dist(a) - dist(b))[0];
        if (top) active.value = top.id;
      },
      { root: opts.root?.value, rootMargin: opts.rootMargin ?? "0px 0px -60% 0px" },
    );
    els.forEach((el) => io!.observe(el));
    active.value ??= els[0]?.id;
  });
  onBeforeUnmount(() => io?.disconnect());
  return { active };
}
