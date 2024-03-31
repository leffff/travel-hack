import { Dialog, Transition } from "@headlessui/react";
import { EventsViewModel } from "@/stores/events.store";
import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { ELEVATION } from "@/lib/constants/elevation";
import CrossIcon from "@/assets/icons/cross.svg";

export const ImageCarousel: FCVM<EventsViewModel> = observer(({ vm }) => {
  const image = vm.expandedImage;
  return (
    <Transition appear show={image !== null} as={Fragment}>
      <Dialog
        className="relative z-100"
        onSubmit={(e) => e.preventDefault()}
        onClose={() => (vm.expandedImage = null)}>
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: ELEVATION.dialog }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Dialog.Panel
              className="relative flex flex-col w-full h-full transition-all bg-bg"
              onSubmit={(e) => e.preventDefault()}>
              <button
                className="absolute top-0 right-0 p-3 transition-colors text-white/30 hover:text-white/70"
                onClick={() => (vm.expandedImage = null)}>
                <CrossIcon className="size-6" />
              </button>
              <div className="flex-1 overflow-hidden">
                <img src={image?.imgSrc} className="h-full mx-auto object-contain" />
              </div>
              <div className="bg-natural2 px-6 py-4 w-full grid grid-cols-2 gap-8">
                <div className="flex flex-col w-full"></div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
});
