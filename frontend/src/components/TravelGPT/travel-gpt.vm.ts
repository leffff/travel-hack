import { downloadImage } from "@/lib/utils/download-image";
import { EventsViewModel } from "@/stores/events.store";
import { makeAutoObservable } from "mobx";

interface ChatMessage {
  id: string;
  text: string;
  author: "user" | "bot";
  date: Date;
  images?: string[];
  markdown?: string;
}

const mockChat: ChatMessage[] = [
  {
    text: "Привет! Чем я могу помочь",
    id: "1",
    author: "bot",
    date: new Date(),
    images: [
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg"
    ]
  },
  {
    text: "Хочу узнать про путешествия",
    id: "2",
    author: "user",
    date: new Date()
  }
];

export class TravelGptViewModel {
  constructor(public parentVm: EventsViewModel) {
    makeAutoObservable(this);
  }

  private _chatMessages = mockChat;
  get chatMessages() {
    return this._chatMessages.slice().reverse();
  }

  text = "";
  loading = false;

  async sendMessage() {
    this.loading = true;
    this._chatMessages.push({
      text: this.text,
      id: Math.random().toString(),
      author: "user",
      date: new Date()
    });

    try {
      const text = this.text;
      this.text = "";

      const res: {
        text_result: string;
        img_urls: string[];
      } = await fetch("https://293a-176-100-240-67.ngrok-free.app/llm_browser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Allow-Control-Allow-Origin": "*"
        },
        signal: AbortSignal.timeout(1200000),
        body: JSON.stringify({ request: text, max_new_tokens: 500 })
      }).then((res) => res.json());

      this._chatMessages.push({
        text: res.text_result,
        id: Math.random().toString(),
        images: res.img_urls,
        author: "bot",
        date: new Date()
      });
    } catch (e) {
      console.log(e);
      this._chatMessages.push({
        text: "Произошла ошибка",
        id: Math.random().toString(),
        date: new Date(),
        author: "bot"
      });
    } finally {
      this.loading = false;
    }
  }

  selectedMessage: ChatMessage | null = null;
  selectMessage(message: ChatMessage | null) {
    this.selectedMessage = message;
  }

  downloadImages() {
    if (this.selectedMessage) {
      this.selectedMessage.images?.forEach((v) => downloadImage(v));
    }
  }
}
