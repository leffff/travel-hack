import { makeAutoObservable } from "mobx";
import { FilterGroupViewModel } from "./filter-group.store";

interface FiltersTemplate {
  timeOfYear: string[] | null;
  timeOfDay: string[] | null;
  screenOrientation: string[] | null;
  format: string[] | null;
}

const convertFilter = <T extends string>(filters: Set<T>): T[] | null => {
  return filters.size > 0 ? Array.from(filters) : null;
};

export class EventFiltersViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  showFilters = false;
  timeOfYear = new FilterGroupViewModel("Время года", ["Зима", "Весна", "Лето", "Осень"] as const);
  timeOfDay = new FilterGroupViewModel("Время суток", ["Утро", "День", "Вечер", "Ночь"] as const);
  screenOrientation = new FilterGroupViewModel("Ориентация", [
    "Горизонтальная",
    "Вертикальная",
    "Квадратная"
  ] as const);
  format = new FilterGroupViewModel("Формат", ["JPG", "PNG", "WEBP"] as const);

  getFilters() {
    return {
      timeOfYear: convertFilter(this.timeOfYear.selectedTags),
      timeOfDay: convertFilter(this.timeOfDay.selectedTags),
      screenOrientation: convertFilter(this.screenOrientation.selectedTags),
      format: convertFilter(this.format.selectedTags)
    };
  }
}
