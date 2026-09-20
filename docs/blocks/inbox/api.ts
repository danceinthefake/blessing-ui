import type { Mail } from "./domain";

export interface MailApi {
  list(): Promise<Mail[]>;
}

/** offline adapter */
export const mockMailApi: MailApi = {
  async list() {
    return [
      {
        id: 1,
        from: "加藤 恵",
        subject: "明日の打ち合わせ",
        preview: "資料は共有フォルダに置いておきました。",
        body: "資料は共有フォルダに置いておきました。\n\n明日は10時からで大丈夫ですか？",
        time: "09:12",
        unread: true,
        tag: "Work",
      },
      {
        id: 2,
        from: "澤村 英梨々",
        subject: "原画のラフ",
        preview: "3枚目、もう少し寄りで描き直す。",
        body: "3枚目、もう少し寄りで描き直す。夜までに送る。",
        time: "08:40",
        unread: true,
      },
      {
        id: 3,
        from: "霞ヶ丘 詩羽",
        subject: "第3章のプロット",
        preview: "添付を確認して。",
        body: "添付を確認して。感想は正直に。",
        time: "昨日",
        unread: false,
        tag: "Script",
      },
      {
        id: 4,
        from: "氷堂 美智留",
        subject: "ライブ来る？",
        preview: "土曜、チケット取っといたから。",
        body: "土曜、チケット取っといたから。来ないと怒る。",
        time: "昨日",
        unread: false,
      },
      {
        id: 5,
        from: "波島 出海",
        subject: "新刊入稿しました！",
        preview: "先輩に一番に報告です。",
        body: "先輩に一番に報告です。次は一緒に出しましょう。",
        time: "月曜",
        unread: false,
      },
    ];
  },
};
