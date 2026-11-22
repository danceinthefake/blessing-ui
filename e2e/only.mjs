// E2E_ONLY limits a run to some pages: a comma-separated list of paths such as
// "/components/toc,/blocks/article". A block path also takes its frame page. Without it, or with
// "*", every page runs; "-" runs none. `node e2e/affected.mjs` prints the list for the changes.
const raw = process.env.E2E_ONLY ?? "*";
const only = raw === "*" || raw === "" ? undefined : raw.split(",").filter(Boolean);

export const wanted = (path) => !only || only.some((o) => path === o || path === `${o}-frame`);

export const note = (total, kept) => (only ? `E2E_ONLY: ${kept} of ${total} pages\n` : "");
