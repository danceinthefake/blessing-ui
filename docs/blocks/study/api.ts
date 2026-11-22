import type { Card } from "./domain";

export interface StudyApi {
  cards(): Promise<Card[]>;
  save(card: Card): Promise<void>;
  add(card: Omit<Card, "id">): Promise<Card>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const card = (id: string, deck: string, front: string, back: string, box: number, due: string) => ({
  id,
  deck,
  front,
  back,
  box,
  due,
});
let seq = 0;

/** offline adapter — replace with calls to your study service */
export const mockStudyApi: StudyApi = {
  async cards() {
    await wait(200);
    return [
      card("w1", "words", "Terima kasih", "Thank you", 4, "2026-11-22"),
      card("w2", "words", "Selamat pagi", "Good morning", 2, "2026-11-21"),
      card("w3", "words", "Berapa harganya?", "How much is it?", 1, "2026-11-22"),
      card("w4", "words", "Di mana stasiun?", "Where is the station?", 1, "2026-11-22"),
      card("w5", "words", "Saya mau teh", "I would like tea", 3, "2026-11-24"),
      card("w6", "words", "Tidak pedas", "Not spicy", 5, "2026-12-01"),
      card("w7", "words", "Sampai jumpa", "See you later", 2, "2026-11-23"),
      card(
        "t1",
        "tea",
        "Oolong",
        "A tea that is partly oxidised, between green and black",
        2,
        "2026-11-22",
      ),
      card(
        "t2",
        "tea",
        "Steep time of green tea",
        "2 to 3 minutes, at 75 to 80 °C",
        1,
        "2026-11-22",
      ),
      card("t3", "tea", "Jasmine tea", "Green tea scented with jasmine flowers", 3, "2026-11-25"),
    ];
  },
  async save() {
    await wait(100);
  },
  async add(c) {
    await wait(300);
    return { ...c, id: `n${++seq}` };
  },
};
