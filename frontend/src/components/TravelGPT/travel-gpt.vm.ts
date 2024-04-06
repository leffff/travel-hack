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
      id: Date.now().toString(),
      author: "user",
      date: new Date()
    });
    this.text = "";

    setTimeout(() => {
      this.loading = false;
    }, 1000);
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
