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

export const Tag = (x: { tag: string; onDelete: () => void }) => {
  return (
    <li className="bg-bg px-2 py-1 text-white rounded-md flex gap-2 items-center text-xs">
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
          {[...vm.selectedTags].sort().map((tag) => (
            <Tag key={tag} tag={tag} onDelete={() => vm.removeTag(tag)} />
          ))}
          {vm.selectedTags.size === 0 && <SearchIcon className="text-text-secondary" />}
          <input
            ref={inputRef}
            className="pl-1 bg-transparent outline-none flex-1"
            type="text"
            placeholder={vm.selectedTags.size ? "" : "Введите запрос, название или #тег"}
            value={vm.search}
            onChange={(e) => vm.updateSearch(e.target.value)}
          />
        </ul>
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
