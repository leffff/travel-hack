import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { EventsViewModel } from "@/stores/events.store";
import { ImageRow } from "./image.row.widget";
import { Spinner } from "@/components/ui/Spinner";
import { ELEVATION } from "@/lib/constants/elevation";

export const ImageFeed: FCVM<EventsViewModel> = observer(({ vm }) => {
  return (
    <div className="flex flex-col pt-4 gap-1 relative min-h-[60vh]">
      {vm.loading && (
        <div
          className="absolute top-4 rounded-xl inset-0 flex bg-white/60"
          style={{ zIndex: ELEVATION.gallerySpinner }}>
          <div className="mx-auto mt-20">
            <Spinner />
          </div>
        </div>
      )}
      {vm.groupedImages.map((group) => (
        <ImageRow key={group.images[0].imgSrc} layout={group.grid} images={group.images} vm={vm} />
      ))}
    </div>
  );
});
