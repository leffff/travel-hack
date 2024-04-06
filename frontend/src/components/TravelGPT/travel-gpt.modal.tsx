import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { TravelGptViewModel } from "./travel-gpt.vm";
import { DialogBase } from "../ui/Dialog";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/Button";

export const TravelGptModal: FCVM<TravelGptViewModel> = observer(({ vm }) => {
  const message = vm.selectedMessage;
  return (
    <DialogBase
      isOpen={vm.selectedMessage !== null}
      onCancel={() => vm.selectMessage(null)}
      className="overflow-hidden"
      width={740}>
      <h1 className="text-2xl text-center pt-6 pb-4 font-bold">Travel GPT</h1>
      <div
        className="mt-6 sm:prose-sm prose w-full max-h-[600px] overflow-auto max-w-4xl text-left"
        style={{
          scrollbarWidth: "thin"
        }}>
        <div className="flex p-4 rounded-lg bg-button-accent">{message?.text}</div>
        {message?.images?.length && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {message.images.map((image, i) => (
                <img key={i} src={image} alt="travel-gpt" className="rounded-lg" />
              ))}
            </div>
            <Button onClick={() => vm.downloadImages()} className="font-medium ml-auto">
              Скачать изображения
            </Button>
          </>
        )}
        <div className="h-5" />
        <ReactMarkdown>{message?.markdown ?? ""}</ReactMarkdown>
      </div>
    </DialogBase>
  );
});
