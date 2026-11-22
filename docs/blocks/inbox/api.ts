import type { BlessEmailDraft } from "blessing-ui";
import type { Mail } from "./domain";

const ME = { name: "安芸 倫也", email: "tomoya@blessing.example" };
const ERIRI = { name: "澤村 英梨々", email: "eriri@blessing.example" };
const UTAHA = { name: "霞ヶ丘 詩羽", email: "utaha@blessing.example" };

export interface MailApi {
  list(): Promise<Mail[]>;
  send(draft: BlessEmailDraft): Promise<void>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** the person who reads this inbox */
export const me = ME;

/** offline adapter */
export const mockMailApi: MailApi = {
  async list() {
    return [
      {
        id: 1,
        from: { name: "加藤 恵", email: "megumi@blessing.example" },
        to: [ME],
        cc: [ERIRI, UTAHA, ME],
        subject: "明日の打ち合わせ",
        preview: "資料は共有フォルダに置いておきました。",
        body: "資料は共有フォルダに置いておきました。\n\n明日は10時からで大丈夫ですか？",
        time: "09:12",
        date: "2026年11月22日 09:12",
        unread: true,
        tag: "Work",
      },
      {
        id: 2,
        from: { name: "澤村 英梨々", email: "eriri@blessing.example" },
        to: [ME],
        subject: "原画のラフ",
        preview: "3枚目、もう少し寄りで描き直す。",
        body: "3枚目、もう少し寄りで描き直す。夜までに送る。",
        time: "08:40",
        date: "2026年11月22日 08:40",
        unread: true,
      },
      {
        id: 3,
        from: { name: "霞ヶ丘 詩羽", email: "utaha@blessing.example" },
        to: [ME],
        subject: "第3章のプロット",
        preview: "添付を確認して。",
        body: "添付を確認して。感想は正直に。",
        time: "昨日",
        date: "2026年11月21日",
        unread: false,
        tag: "Script",
      },
      {
        id: 4,
        from: { name: "氷堂 美智留", email: "michiru@blessing.example" },
        to: [ME],
        subject: "ライブ来る？",
        preview: "土曜、チケット取っといたから。",
        body: "土曜、チケット取っといたから。来ないと怒る。",
        time: "昨日",
        date: "2026年11月21日",
        unread: false,
      },
      {
        id: 5,
        from: { name: "波島 出海", email: "izumi@blessing.example" },
        to: [ME],
        subject: "新刊入稿しました！",
        preview: "先輩に一番に報告です。",
        body: "先輩に一番に報告です。次は一緒に出しましょう。",
        time: "月曜",
        date: "2026年11月16日",
        unread: false,
      },
    ];
  },
  async send() {
    await wait(400);
  },
};
