export interface ChatMessage {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
}
export const now = () => new Date().toTimeString().slice(0, 5);
