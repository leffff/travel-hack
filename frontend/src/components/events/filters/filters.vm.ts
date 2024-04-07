import { makeAutoObservable } from "mobx";
import { FilterGroupViewModel } from "./filter-group.store";
import { ImageDto, ImageFilters } from "@/api/models/image.model";

interface FiltersTemplate {
  timeOfYear: string[] | null;
  timeOfDay: string[] | null;
  screenOrientation: string[] | null;
  format: string[] | null;
}

const convertFilter = <T extends string>(filters: Set<T>): T | null => {
  return filters.size > 0 ? Array.from(filters)[0]! : null;
};

export class EventFiltersViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  showFilters = false;
  timeOfYear = new FilterGroupViewModel<keyof typeof ImageFilters.TimeOfYear>("Время года", [
    "Зима",
    "Весна",
    "Лето",
    "Осень"
  ]);
  timeOfDay = new FilterGroupViewModel<keyof typeof ImageFilters.TimeOfDay>("Время суток", [
    "Утро",
    "День",
    "Вечер",
    "Ночь"
  ]);
  screenOrientation = new FilterGroupViewModel<keyof typeof ImageFilters.ScreenOrientation>(
    "Ориентация",
    ["Горизонтальная", "Вертикальная", "Квадратная"]
  );
  format = new FilterGroupViewModel<keyof typeof ImageFilters.Format>("Формат", [
    "JPG",
    "PNG",
    "WEBP"
  ]);

  getFilters() {
    return {
      timeOfYear: convertFilter(this.timeOfYear.selectedTags),
      timeOfDay: convertFilter(this.timeOfDay.selectedTags),
      screenOrientation: convertFilter(this.screenOrientation.selectedTags),
      format: convertFilter(this.format.selectedTags)
    };
  }
}
