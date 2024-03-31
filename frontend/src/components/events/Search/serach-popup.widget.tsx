import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useRef, useState } from "react";
import { SearchPopupViewModel } from "./search-popup.vm";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "../../ui/Spinner";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { ELEVATION } from "@/lib/constants/elevation";

const Tag = (x: { text: string; search: string; selected: boolean; onClick: () => void }) => {
  const ref = useRef<HTMLLIElement>(null);
  const searchPart = x.text.slice(0, x.search.length);
  const rest = x.text.slice(x.search.length);

  useEffect(() => {
    if (x.selected && ref.current) {
      ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [x.selected]);

  return (
    <li
      onClick={x.onClick}
      className={cn(
        "py-1 px-2 rounded-lg cursor-pointer hover:bg-bg-content",
        x.selected && "bg-bg-content"
      )}
      ref={ref}>
      <p className={"rounded-md bg-bg-content px-2 py-1 w-fit"}>
        #<span className="bg-primary">{searchPart}</span>
        {rest}
      </p>
    </li>
  );
};

export const SearchPopup: FCVM<SearchPopupViewModel> = observer((x) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => x.vm.hide());

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          x.vm.onArrowDown();
          break;
        case "ArrowUp":
          x.vm.onArrowUp();
          break;
        case "Enter":
          x.vm.onEnter();
          break;
        case "Escape":
          x.vm.hide();
          break;
      }
    };

    document.addEventListener("keydown", onKeydown);

    return () => document.removeEventListener("keydown", onKeydown);
  }, [x.vm]);

  if (!x.vm.visible) return null;

  return (
    <div
      ref={ref}
      className="appear absolute top-[calc(100%+8px)] rounded-xl left-0 w-full px-12 py-8 bg-white text-bg flex flex-col shadow-dropdown"
      style={{ zIndex: ELEVATION.searchPopup }}>
      {x.vm.parentVm.isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Spinner />
        </div>
      ) : (
        <>
          <ul>
            {[...x.vm.searchedTags].map((tag, i) => (
              <Tag
                key={tag}
                search={x.vm.parentVm.search}
                text={tag}
                selected={x.vm.selected === i}
                onClick={() => x.vm.onTagClick(tag)}
              />
            ))}
          </ul>
          {x.vm.tagsLeft > 0 && (
            <span className="flex p-4 pb-0 text-text-secondary">
              Еще тегов по запросу: {x.vm.tagsLeft}. Для отображения скорректируйте запрос
            </span>
          )}
        </>
      )}
    </div>
  );
});
