import { makeAutoObservable } from "mobx";
import { SearchPopupViewModel } from "./search-popup.vm";
import { debounce, debounceAsync } from "@/lib/utils/debounce";
import { EventsViewModel } from "@/stores/events.store";
import { TagsEndpoint } from "@/api/endpoints/tags.endpoint";
import { ImagesEndpoint } from "@/api/endpoints/image.endpoint";

export class SearchViewModel {
  constructor(public parent: EventsViewModel) {
    makeAutoObservable(this);
    this.popupVm.searchedTags = new Set();
  }

  isLoading = false;
  popupVm = new SearchPopupViewModel(this);
  search = "";
  updateSearch(search: string, append?: boolean) {
    if (append) {
      this.search += search;
    } else {
      this.search = search;
    }
    this.popupVm.visible = search.length > 0;
    this.isLoading = true;
    this.findTags(search);
  }

  private findTags = debounceAsync(async (search: string) => {
    if (search === "") {
      this.isLoading = false;
      return;
    }
    const res = await TagsEndpoint.searchByName(search);
    this.popupVm.searchedTags = new Set(res.tags);
    this.popupVm.tagsLeft = res.count - res.tags.length;
    this.isLoading = false;
  }, 500);

  private _tags: Set<string> = new Set();
  get selectedTags(): Set<string> {
    return this._tags;
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

  async onSubmit() {
    if (this.popupVm.selected !== null) {
      return; // handled by popup
    }
    this.isLoading = true;

    this.popupVm.hide();

    this.parent.onSearch();

    this.isLoading = false;
  }

  getSearch() {
    return {
      tags: [...this._tags],
      search: this.search
    };
  }

  imageSearchLoading = false;
  async onImageUpload(file: File) {
    this.imageSearchLoading = true;
    try {
      const res = await ImagesEndpoint.searchByImage(file);
      this.parent.images = res;
    } finally {
      this.imageSearchLoading = false;
    }
  }
}
