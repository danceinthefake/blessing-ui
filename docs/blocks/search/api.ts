import { didYouMean, search, words, type Doc, type Page, type Query } from "./domain";

export interface SearchApi {
  search(query: Query): Promise<Page>;
  /** what people search for most */
  popular(): Promise<string[]>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const site = "https://help.awankerja.test";
const doc = (id: string, kind: string, date: string, title: string, snippet: string): Doc => ({
  id,
  kind,
  date,
  title,
  snippet,
  href: `${site}/${kind.toLowerCase()}s/${id}`,
});
const DOCS: Doc[] = [
  doc(
    "invite-team",
    "Guide",
    "2026-10-02",
    "Invite your team",
    "Send an invite by email or share a link. Each person you invite takes one seat of your plan.",
  ),
  doc(
    "remove-member",
    "Guide",
    "2026-08-14",
    "Remove a member from the team",
    "A removed member loses access at once. Their files stay in the workspace, and the seat is free again.",
  ),
  doc(
    "roles",
    "Article",
    "2026-06-20",
    "Roles and permissions",
    "Owners manage billing. Admins invite and remove members. Members edit the files they can open.",
  ),
  doc(
    "change-plan",
    "Guide",
    "2026-11-03",
    "Change your plan",
    "Move to a bigger plan at any time. A smaller plan must hold your seats and your files.",
  ),
  doc(
    "invoices",
    "Article",
    "2026-09-11",
    "Find and pay your invoices",
    "Every invoice is on the Billing page. Pay an overdue invoice with the card on file.",
  ),
  doc(
    "cancel",
    "Guide",
    "2025-12-01",
    "Cancel your plan",
    "After a cancel, you keep the plan until the end of the month. You can keep the plan again before that day.",
  ),
  doc(
    "storage",
    "Article",
    "2025-10-21",
    "How storage is counted",
    "Every version of a file counts toward your storage. Empty the bin to free space.",
  ),
  doc(
    "upload-limits",
    "Article",
    "2025-07-09",
    "Upload limits",
    "One file can be up to 50 MB. Upload a folder to keep its structure.",
  ),
  doc(
    "share-files",
    "Guide",
    "2026-03-15",
    "Share a file or a folder",
    "Share with people in your team, or make a link that anyone can open.",
  ),
  doc(
    "two-step",
    "Guide",
    "2026-02-02",
    "Turn on two-step sign-in",
    "Use an app on your phone for a code at each sign-in. Keep the backup codes in a safe place.",
  ),
  doc(
    "lost-phone",
    "Article",
    "2025-11-30",
    "Sign in after you lose your phone",
    "Use a backup code, or ask an owner of your team to turn off two-step sign-in for you.",
  ),
  doc(
    "security-paper",
    "PDF",
    "2026-05-05",
    "Security overview",
    "How we store your files, who can open them, and what we do after a security problem.",
  ),
  doc(
    "price-list",
    "PDF",
    "2026-01-10",
    "Price list 2026",
    "The prices of each plan and of extra seats and extra storage, with tax.",
  ),
  doc(
    "export",
    "Guide",
    "2025-09-18",
    "Export all your files",
    "Get one archive with every file of the workspace. Large workspaces take up to an hour.",
  ),
  doc(
    "api-keys",
    "Article",
    "2026-07-07",
    "Make an API key",
    "Owners and admins make keys in Settings. A key can read files or change them, not both.",
  ),
  doc(
    "offline",
    "Article",
    "2025-06-01",
    "Work offline",
    "The desktop app keeps the files you mark for offline use, and sends your changes when you are back online.",
  ),
];
const VOCABULARY = new Set(DOCS.flatMap((d) => words(`${d.title} ${d.snippet}`)));

/** offline adapter — replace with calls to your search engine */
export const mockSearchApi: SearchApi = {
  async search(query) {
    await wait(250);
    return { ...search(DOCS, query), suggestion: didYouMean(query.q, VOCABULARY) || undefined };
  },
  async popular() {
    return ["invite", "invoice", "storage", "two-step sign-in", "cancel"];
  },
};
