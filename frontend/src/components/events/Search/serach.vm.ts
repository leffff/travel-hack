import { makeAutoObservable } from "mobx";
import { SearchPopupViewModel } from "./search-popup.vm";
import { debounce, debounceAsync } from "@/lib/utils/debounce";
import { EventsViewModel } from "@/stores/events.store";

const mockTags = [
  "tag1",
  "tag2",
  "tag3",
  "tag4",
  "tag5",
  "tag6",
  "tag7",
  "tag8",
  "tag9",
  "tag10",
  "tag11",
  "tag12"
];

export class SearchViewModel {
  constructor(public parent: EventsViewModel) {
    makeAutoObservable(this);
    this.popupVm.searchedTags = new Set(mockTags);
  }

  isLoading = false;
  popupVm = new SearchPopupViewModel(this);
  search = "";
  updateSearch(search: string) {
    this.search = search;
    this.popupVm.visible = search.length > 0;
    this.popupVm.searchedTags = new Set(mockTags.filter((tag) => tag.includes(this.search)));
    this.isLoading = true;
    this.findTags(search);
  }

  private findTags = debounceAsync(async (search: string) => {
    console.log("searching...", search);
    this.isLoading = false;
  }, 500);

  private _tags: Set<string> = new Set(mockTags);
  get selectedTags(): Set<string> {
    return this._tags;
  }

  get searchedTags(): string[] {
    return mockTags.filter((tag) => tag.includes(this.search));
  }

  addTag(tag: string) {
    this._tags.add(tag);
    this.search = "";
  }

  removeTag(tag: string) {
    this._tags.delete(tag);
  }

  clearFilters() {
    this._tags.clear();
    this.search = "";
    this.popupVm.hide();
  }

  onSubmit = async () => {
    if (this.popupVm.selected !== null) {
      return; // handled by popup
    }
    this.isLoading = true;

    this.popupVm.hide();

    console.log("searching...", this.search);

    this.isLoading = false;
  };

  getSearch() {
    return {
      tags: [...this._tags],
      search: this.search
    };
  }

  imageSearchLoading = false;
  async onImageUpload(file: File) {
    this.imageSearchLoading = true;
    console.log("uploading image...", file);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.imageSearchLoading = false;
  }
}
