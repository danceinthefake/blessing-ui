import { reactive } from "vue";

const state = reactive({ active: false, progress: 0 });
let timer: ReturnType<typeof setInterval> | undefined;
let fade: ReturnType<typeof setTimeout> | undefined;
let pending = 0;

/** Top-of-page progress bar (Quasar LoadingBar / nprogress style). Mount <BlessLoadingBar /> once. */
export function useLoadingBar() {
  function start() {
    pending++;
    // a start() during the finish fade keeps the bar up instead of letting the fade reset it
    if (fade) {
      clearTimeout(fade);
      fade = undefined;
    }
    if (state.active && timer) return;
    state.active = true;
    state.progress = 8;
    // trickle towards 90% while pending
    timer = setInterval(
      () => (state.progress = Math.min(90, state.progress + (90 - state.progress) * 0.1)),
      250,
    );
  }
  function stop() {
    pending = Math.max(0, pending - 1);
    if (pending) return;
    clearInterval(timer);
    timer = undefined;
    state.progress = 100;
    fade = setTimeout(() => {
      fade = undefined;
      if (pending) return;
      state.active = false;
      state.progress = 0;
    }, 300);
  }
  function set(p: number) {
    state.progress = Math.max(0, Math.min(100, p));
  }
  /** wrap a promise */
  async function track<T>(p: Promise<T>): Promise<T> {
    start();
    try {
      return await p;
    } finally {
      stop();
    }
  }
  return { start, stop, set, track, state };
}

export const loadingBarState = state;
