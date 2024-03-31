import { EventsViewModel } from "@/stores/events.store";
import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { Button } from "../ui/Button";
import DownloadIcon from "@/assets/icons/download.svg";
import { useState } from "react";
import { DialogBase } from "../ui/Dialog";
import { convertFileSize } from "@/lib/utils/convert-file-size";
import { Checkmark, CheckmarkWithLabel } from "../ui/Checkmark";

const pluralize = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} файл`;
  } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
    return `${count} файла`;
  } else {
    return `${count} файлов`;
  }
};

export const SelectedImages: FCVM<EventsViewModel> = observer(({ vm }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  if (vm.selectedImages.size === 0) return;

  return (
    <>
      <div className="text-text appear sticky w-full items-center bg-white bottom-0 px-6 py-4 shadow-dropdown rounded-t-3xl flex justify-between">
        <h2 className="text-sm font-bold">Выбрано {vm.selectedImages.size}</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowConfirmModal(true)}>
            <DownloadIcon className="size-5" />
            Скачать выбранное
          </Button>
          <Button variant="outline" onClick={() => (vm.selectedImages = new Set())}>
            Отмена
          </Button>
        </div>
      </div>
      <DialogBase isOpen={showConfirmModal} onCancel={() => setShowConfirmModal(false)} width={480}>
        <h1 className="text-2xl text-center pt-6 pb-10 font-bold">
          Скачать {pluralize(vm.selectedImages.size)}?
        </h1>
        <Button
          className="justify-center w-full font-medium"
          onClick={() => {
            vm.downloadSelectedImages();
            setShowConfirmModal(false);
          }}>
          Скачать {convertFileSize(vm.selectedImagesSize)}
          <DownloadIcon className="size-5" />
        </Button>
        <div className="flex flex-col gap-1 mt-4 text-text-secondary text-xs text-wrap text-left">
          Обратите внимание на ограничения использования, установленные Лицензионным соглашением.
          <CheckmarkWithLabel
            checked
            label={
              <p>
                Соглашаюсь с условиями{" "}
                <span className="text-primary">Лицензионного соглашения</span>
              </p>
            }
          />
        </div>
      </DialogBase>
    </>
  );
});
