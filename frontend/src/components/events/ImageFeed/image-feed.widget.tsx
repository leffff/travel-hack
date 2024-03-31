import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { EventsViewModel } from "@/stores/events.store";
import { ImageRow } from "./image.row.widget";

export const ImageFeed: FCVM<EventsViewModel> = observer(({ vm }) => {
  return (
    <div className="flex flex-col pt-4 gap-1">
      {vm.groupedImages.map((group, i) => (
        <ImageRow key={i} layout={group.grid} images={group.images} vm={vm} />
      ))}
    </div>
  );
});
