import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, ReactNode } from "react";
import CrossIcon from "@/assets/icons/cross.svg";
import { ELEVATION } from "@/lib/constants/elevation";
import { cn } from "@/lib/utils/cn";

interface DialogBaseProps {
  isOpen: boolean;
  onCancel?: () => void;
  children?: ReactNode;
  width?: string | number;
  className?: string;
}

export const DialogBase: FC<DialogBaseProps> = ({
  isOpen,
  onCancel,
  children,
  width,
  className
}) => {
  function closeModal() {
    onCancel?.();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className={"relative z-100"}
        onClose={closeModal}
        onSubmit={(e) => e.preventDefault()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Dialog.Backdrop
            className="fixed inset-0 bg-black/30"
            style={{ zIndex: ELEVATION.dialogBackdrop }}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: ELEVATION.dialog }}>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel
                onSubmit={(e) => e.preventDefault()}
                className={cn(
                  "w-fit transform bg-white transition-all rounded-2xl py-6 px-10 sm:px-14 relative",
                  className
                )}
                style={{ width }}>
                <div className="flex flex-col">{children}</div>
                {onCancel && (
                  <button
                    className="absolute top-0 right-0 sm:top-2 sm:right-2 size-12 flex items-center justify-center"
                    onClick={onCancel}>
                    <div className="rounded-full bg-button-accent size-6 flex items-center justify-center">
                      <CrossIcon className="text-text-secondary size-4" />
                    </div>
                  </button>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
