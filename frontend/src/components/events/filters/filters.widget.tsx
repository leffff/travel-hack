import { FCVM } from "@/utils/vm";
import { observer } from "mobx-react-lite";
import { FilterGroupViewModel } from "@/components/events/filters/filter-group.store";
import { CheckmarkWithLabel } from "../../ui/Checkmark";
import { EventFiltersViewModel } from "./filters.vm";
import { useEffect, useRef } from "react";

const FilterGroup = observer(<T extends string>({ vm }: { vm: FilterGroupViewModel<T> }) => {
  return (
    <ul className="flex flex-col pr-14 gap-2 text-sm">
      <li className="text-text-secondary">{vm.name}</li>
      {vm.tags.map((tag) => (
        <li key={tag}>
          <CheckmarkWithLabel
            label={tag}
            size={16}
            checked={vm.selectedTags.has(tag)}
            onClick={() => {
              vm.selectedTags = new Set([tag]);
            }}
          />
        </li>
      ))}
    </ul>
  );
});

export const EventFilters: FCVM<EventFiltersViewModel> = observer(({ vm }) => {
  if (!vm.showFilters) return;

  return (
    <div className="flex justify-between flex-col sm:flex-row p-6 bg-button-accent w-full gap-6 rounded-2xl">
      <FilterGroup vm={vm.timeOfYear} />
      <FilterGroup vm={vm.timeOfDay} />
      <FilterGroup vm={vm.screenOrientation} />
      <FilterGroup vm={vm.format} />
    </div>
  );
});
