import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { SearchViewModel } from "./serach.vm";
import SearchIcon from "@/assets/icons/search.svg";
import CrossIcon from "@/assets/icons/cross.svg";
import FiltersIcon from "@/assets/icons/filters.svg";
import { useRef } from "react";
import { Button } from "../../ui/Button";
import { SearchPopup } from "./serach-popup.widget";
import { ELEVATION } from "@/lib/constants/elevation";
import { ImageSearch } from "./image-search.widget";

export const Tag = (x: { tag: string; onDelete: () => void }) => {
  return (
    <li className="bg-bg px-2 py-1 text-white rounded-md flex gap-2 items-center text-xs h-fit">
      #{x.tag}
      <button
        onClick={(e) => {
          x.onDelete();
          e.stopPropagation;
        }}
        type="button">
        <CrossIcon className="size-4 text-text-secondary" />
      </button>
    </li>
  );
};

export const SearchWidget: FCVM<SearchViewModel> = observer(({ vm }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedTags = [...vm.selectedTags].sort();

  return (
    <div
      className="sticky top-0 w-full flex flex-col md:flex-row gap-2 bg-bg-content pt-6 pb-4"
      style={{ zIndex: ELEVATION.searchPopup }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          vm.onSubmit();
        }}
        onClick={() => inputRef.current?.focus()}
        className="relative flex-1 border focus-within:border-primary bg-white flex py-3 px-4 rounded-xl cursor-text">
        <ul className="gap-1 flex flex-wrap w-full">
          {sortedTags.map((tag) => (
            <Tag key={tag} tag={tag} onDelete={() => vm.removeTag(tag)} />
          ))}
          {vm.selectedTags.size === 0 && <SearchIcon className="text-text-secondary" />}
          <input
            ref={inputRef}
            className="pl-1 bg-transparent outline-none flex-1 h-fit"
            type="text"
            placeholder={vm.selectedTags.size ? "" : "Введите запрос, название или #тег"}
            value={vm.search}
            onChange={(e) => vm.updateSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && vm.search.length === 0) {
                vm.removeTag(sortedTags.pop()!);
              }
            }}
          />
        </ul>
        <div className="flex gap-2">
          {(vm.selectedTags.size > 0 || vm.search.length > 0) && (
            <button
              onClick={() => {
                vm.clearFilters();
                inputRef.current?.focus();
              }}
              type="button"
              className="h-fit">
              <CrossIcon className="size-6 text-bg" />
            </button>
          )}
          <ImageSearch vm={vm} />
        </div>
        <SearchPopup vm={vm.popupVm} />
      </form>
      <Button
        variant="accent"
        onClick={() => (vm.parent.filtersVm.showFilters = !vm.parent.filtersVm.showFilters)}>
        {vm.parent.filtersVm.showFilters ? (
          <>
            Скрыть фильтры
            <CrossIcon className="size-6" />
          </>
        ) : (
          <>
            Фильтры
            <FiltersIcon className="size-6" />
          </>
        )}
      </Button>
      <Button>
        Найти
        <SearchIcon className="size-6" />
      </Button>
    </div>
  );
});
