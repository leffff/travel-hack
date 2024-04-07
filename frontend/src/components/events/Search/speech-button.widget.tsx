import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { SearchViewModel } from "./serach.vm";
import MicrophoneIcon from "@/assets/icons/microphone.svg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import { debounce, throttle } from "@/lib/utils/debounce";

export const SpeechButton: FCVM<SearchViewModel> = observer(({ vm }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const appendText = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length === 0) return; // prevent first debounce

        vm.updateSearch(" " + text, true);
        resetTranscript();
      }, 200),
    [vm, resetTranscript]
  );
  const onSpeech = useMemo(
    () =>
      debounce(() => {
        SpeechRecognition.stopListening();
      }, 4000),
    []
  );

  useEffect(() => {
    appendText(transcript);
    onSpeech();
  }, [transcript, appendText, onSpeech]);

  if (!browserSupportsSpeechRecognition) return;

  return (
    <button
      className="h-fit"
      type="button"
      onClick={() => {
        if (listening) {
          SpeechRecognition.stopListening();
          return;
        }
        SpeechRecognition.startListening({ language: "ru-RU", continuous: true });
      }}>
      <MicrophoneIcon className={cn("size-6", listening ? "text-red-500" : "text-bg")} />
    </button>
  );
});
