import { ImageDto } from "@/api/models/image.model";
import { EventsViewModel } from "@/stores/events.store";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { cn } from "@/lib/utils/cn";
import { Checkmark } from "../../ui/Checkmark";

interface Props {
  images: ImageDto.Item[];
  vm: EventsViewModel;
  layout: number;
}

export const ImageRow: FC<Props> = observer((x) => {
  return (
    <div
      className={cn(
        "md:grid gap-1 md:grid-rows-[1fr,1fr]",
        x.layout === 1 && "grid-cols-[1fr,1fr,1fr,1fr]",
        x.layout === 2 && "grid-cols-[1fr,1fr]",
        x.layout === 3 && "grid-cols-[1fr,1.5fr,1fr]",
        x.layout === 4 && "grid-cols-[0.75fr,0.75fr,1fr]",
        "flex flex-col"
      )}>
      {x.images.map((image) => {
        const isSelected = x.vm.selectedImages.has(image);

        return (
          <div
            key={image.imgSrc}
            onClick={() => x.vm.openImage(image)}
            className={cn(
              "relative group h-[500px] cursor-pointer rounded-lg",
              x.layout === 1 &&
                "row-span-2 [&:nth-child(4)]:row-span-1 [&:nth-child(5)]:row-span-1 [&:nth-child(4)]:h-[248px] [&:nth-child(5)]:h-[248px]",
              x.layout === 2 && "row-span-2",
              x.layout === 3 && "row-span-2",
              x.layout === 4 &&
                "h-[248px] row-span-1 [&:nth-child(3)]:row-span-2 [&:nth-child(3)]:h-[500px]"
            )}>
            <img
              src={image.imgSrc}
              alt={image.title}
              loading="lazy"
              className={cn(
                "object-cover w-full h-full rounded-lg border-2 border-transparent",
                isSelected && "border-primary"
              )}
            />
            <div className="absolute inset-0 bg-text/15 transition-opacity opacity-0 group-hover:opacity-100 rounded-lg">
              <div className="flex flex-col w-full h-full">
                <div className="ml-auto mt-2 mr-2 flex items-center justify-center py-1.5 px-2 uppercase text-sm bg-bg/15 rounded-lg text-white">
                  {image.extension}
                </div>
                <div className="mt-auto p-5">
                  <h3 className="font-bold text-white">{image.title}</h3>
                  <p className="text-sm text-white/50 capitalize overflow-hidden text-ellipsis">
                    {image.tags.join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "absolute top-3 left-3 transition-opacity sm:opacity-0 group-hover:opacity-100",
                isSelected && "opacity-100"
              )}>
              <Checkmark
                onClick={(e) => {
                  e.stopPropagation();
                  x.vm.toggleImage(image);
                }}
                className={cn(
                  "size-7 min-h-7 max-h-7 min-w-7 max-w-7",
                  "sm:size-5 sm:min-h-5 sm:max-h-5 sm:min-w-5 sm:max-w-5"
                )}
                checked={isSelected}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
});
