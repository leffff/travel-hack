import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { SearchViewModel } from "./serach.vm";
import { DialogBase } from "@/components/ui/Dialog";
import { useEffect, useState } from "react";
import CameraIcon from "@/assets/icons/camera.svg";
import { cn } from "@/lib/utils/cn";
import UploadIcon from "@/assets/icons/upload.svg";
import { Spinner } from "@/components/ui/Spinner";

export const ImageSearch: FCVM<SearchViewModel> = observer(({ vm }) => {
  const [dragOverImage, setDragOverImage] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!vm.imageSearchLoading) {
      setOpen(false);
    }
  }, [vm.imageSearchLoading]);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button" className="h-fit">
        <CameraIcon className="size-6 text-bg" />
      </button>
      <DialogBase isOpen={open} onCancel={() => setOpen(false)}>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl text-center pt-6 font-bold">Поиск по фотографии</h1>

          <span className="mt-1 text-text-secondary/80 text-sm text-wrap text-left">
            Перетащите фотографию для начала поиска
          </span>
          <div
            className={cn(
              "w-full h-32 transition-all mt-4 border-2 border-primary border-dashed rounded-xl flex justify-center items-center relative",
              dragOverImage && "border-solid border-primary/50 bg-primary/5",
              vm.imageSearchLoading && "opacity-50 pointer-events-none"
            )}>
            {vm.imageSearchLoading ? (
              <Spinner />
            ) : (
              <>
                <input
                  type="file"
                  className="absolute opacity-0 inset-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      vm.onImageUpload(file);
                    }
                    setDragOverImage(false);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverImage(true);
                  }}
                  onDragLeave={() => setDragOverImage(false)}
                />
                <UploadIcon className="size-8 text-text-secondary absolute inset-auto" />
              </>
            )}
          </div>
        </div>
      </DialogBase>
    </>
  );
});
