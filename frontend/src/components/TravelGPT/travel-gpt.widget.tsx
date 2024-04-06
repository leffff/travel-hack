import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { TravelGptViewModel } from "./travel-gpt.vm";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "../ui/Button";
import { ELEVATION } from "@/lib/constants/elevation";
import CrossIcon from "@/assets/icons/cross.svg";
import SendIcon from "@/assets/icons/send.svg";
import TravelGptIcon from "@/assets/icons/travel-gpt.svg";
import { Spinner } from "../ui/Spinner";
import { TravelGptModal } from "./travel-gpt.modal";

export const TravelGpt: FCVM<TravelGptViewModel> = observer(({ vm }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!vm.loading) {
      inputRef?.current?.focus();
    }
  }, [vm.loading]);

  return (
    <>
      <TravelGptModal vm={vm} />
      <div
        className={cn(
          "flex absolute bottom-3 right-3",
          vm.parentVm.selectedImages.size > 0 && "bottom-24 2xl:bottom-3",
          vm.parentVm.selectedImages.size > 0 && !hidden && "!bottom-24"
        )}
        style={{ zIndex: ELEVATION.travelGpt }}>
        <div className={cn("relative flex flex-col", hidden ? "h-14 w-fit" : "h-[500px] w-96")}>
          {!hidden ? (
            <div className="appear flex flex-col w-full h-full p-4 bg-white rounded-2xl border border-button-outline shadow-travelGpt">
              <div className="flex justify-between items-center">
                <h1 className="text-xl">Чем я могу помочь?</h1>
                <CrossIcon className="size-6 cursor-pointer" onClick={() => setHidden(!hidden)} />
              </div>
              <div
                className={cn(
                  "flex-1 flex flex-col overflow-auto pt-2",
                  vm.chatMessages.length !== 0 && "flex-col-reverse"
                )}>
                {vm.chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-2 rounded-xl flex flex-col max-w-[80%] mb-2",
                      message.author === "bot"
                        ? "bg-button-accent/80 rounded-bl-none"
                        : "bg-primary ml-auto rounded-br-none"
                    )}>
                    {message.text}
                    {message.author === "bot" && (
                      <Button
                        onClick={() => vm.selectMessage(message)}
                        variant="outline"
                        className="px-4 py-2 mt-2">
                        Раскрыть подробности
                      </Button>
                    )}
                  </div>
                ))}
                {vm.chatMessages.length === 0 && (
                  <ul className={"flex flex-col gap-1"}>
                    <Button variant="outline" className="w-fit text-text-secondary">
                      Что посетить в Москве?
                    </Button>
                    <Button variant="outline" className="w-fit text-text-secondary">
                      Какие парки посоветуешь?
                    </Button>
                    <Button variant="outline" className="w-fit text-text-secondary">
                      Какие места посоветуешь в центре?
                    </Button>
                  </ul>
                )}
              </div>
              <form
                className="flex items-center relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (vm.text.trim() === "") return;
                  vm.sendMessage();
                }}>
                <input
                  autoFocus
                  ref={inputRef}
                  disabled={vm.loading}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setHidden(true);
                    }
                  }}
                  onChange={(e) => (vm.text = e.target.value)}
                  value={vm.text}
                  className="flex-1 py-3 px-4 border rounded-xl pr-12 outline-primary"
                  placeholder="Напишите вопрос"
                />
                <SendIcon className="absolute right-4 cursor-pointer size-5 text-primary" />
              </form>
            </div>
          ) : (
            <Button
              className="w-fit rounded-full ml-auto shadow-travelGpt"
              onClick={() => setHidden(!hidden)}>
              Задать вопрос <TravelGptIcon />
            </Button>
          )}
          {vm.loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
});
