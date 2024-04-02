import { Dialog, Transition } from "@headlessui/react";
import { EventsViewModel } from "@/stores/events.store";
import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { ELEVATION } from "@/lib/constants/elevation";
import CrossIcon from "@/assets/icons/cross.svg";
import { CheckmarkWithLabel } from "@/components/ui/Checkmark";
import { Button } from "@/components/ui/Button";
import { convertFileSize } from "@/lib/utils/convert-file-size";
import DownloadIcon from "@/assets/icons/download.svg";

export const ImageCarousel: FCVM<EventsViewModel> = observer(({ vm }) => {
  const [expanded, setExpanded] = useState(false);
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const image = vm.expandedImage;

  useEffect(() => {
    if (image) {
      setExpanded(true);
    }
  }, [image]);

  const onClose = () => {
    setExpanded(false);
    setTimeout(() => {
      vm.expandedImage = null;
    }, 500);
  };

  return (
    <Transition appear show={expanded} as={Fragment}>
      <Dialog
        className="relative z-100"
        onSubmit={(e) => e.preventDefault()}
        onClose={() => onClose()}>
        <div
          className="fixed inset-0 overflow-hidden text-white"
          style={{ zIndex: ELEVATION.dialog }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Dialog.Panel
              className="relative flex flex-col w-full overflow-auto h-full transition-all bg-bg"
              onSubmit={(e) => e.preventDefault()}>
              <button
                className="absolute top-0 right-0 p-3 transition-colors text-white/30 hover:text-white/70"
                onClick={onClose}>
                <CrossIcon className="size-6" />
              </button>
              <div className="flex-1 flex sm:overflow-hidden">
                <img src={image?.imgSrc} className="w-full sm:h-full m-auto object-contain" />
              </div>
              <div className="bg-natural2">
                <div className="section py-4 w-full flex flex-col md:grid grid-cols-2 gap-8">
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-2">
                      <h2>{image?.title}</h2>
                      <span className="text-checkbox-border text-sm uppercase">
                        {image?.extension}, {image?.resolution.join("x")}
                      </span>
                    </div>
                    <ul className="flex flex-wrap text-xs gap-1">
                      {image?.tags.map((tag, index) => (
                        <li
                          key={index}
                          className="bg-bg/15 px-2 py-1 flex rounded-md flex-wrap items-center justify-center font-medium">
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full gap-4 items-center">
                    <div className="flex flex-col gap-1 text-xs text-wrap text-left">
                      Обратите внимание на ограничения использования, установленные Лицензионным
                      соглашением.
                      <CheckmarkWithLabel
                        checked={licenseAccepted}
                        onClick={() => {
                          setLicenseAccepted(!licenseAccepted);
                        }}
                        label={
                          <p>
                            Соглашаюсь с условиями{" "}
                            <span className="text-primary">Лицензионного соглашения</span>
                          </p>
                        }
                      />
                    </div>
                    <span className="h-full w-px bg-white/15" />
                    <Button
                      variant="accent"
                      className="w-full sm:w-fit text-text text-nowrap items-center">
                      {image && convertFileSize(image.fileSize)}
                      <DownloadIcon className="size-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
});
