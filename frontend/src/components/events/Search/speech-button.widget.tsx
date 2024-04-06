import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { SearchViewModel } from "./serach.vm";
import MicrophoneIcon from "@/assets/icons/microphone.svg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";

export const SpeechButton: FCVM<SearchViewModel> = observer(({ vm }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript.length > 0) {
      vm.updateSearch(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript, vm]);

  if (!browserSupportsSpeechRecognition) return;

  return (
    <button
      className="h-fit"
      onClick={() => {
        if (listening) {
          SpeechRecognition.stopListening();
          return;
        }
        SpeechRecognition.startListening({ continuous: true });
      }}>
      <MicrophoneIcon className={cn("size-6", listening ? "text-red-500" : "text-bg")} />
    </button>
  );
});
