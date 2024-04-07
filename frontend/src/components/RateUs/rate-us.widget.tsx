import { EventsViewModel } from "@/stores/events.store";
import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import { DialogBase } from "../ui/Dialog";
import StarIcon from "@/assets/icons/star.svg";

export const RateUsWidget: FC<{ show: boolean; setShow: (v: boolean) => void }> = observer((x) => {
  const [starsHovered, setStarsHovered] = useState(0);

  return (
    <DialogBase isOpen={x.show} onCancel={() => x.setShow(false)} width={430}>
      <h1>Пожалуйста, оцените работу сервиса</h1>
      <div className="flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            className={`size-12 cursor-pointer py-1 ${i <= starsHovered ? "text-primary" : "text-[#4D4D4D]"}`}
            onMouseEnter={() => setStarsHovered(i)}
            onMouseLeave={() => setStarsHovered(0)}
            onClick={() => {
              x.setShow(false);
            }}
          />
        ))}
      </div>
    </DialogBase>
  );
});
