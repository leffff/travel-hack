import { makeAutoObservable } from "mobx";
import { SearchViewModel } from "./serach.vm";

export class SearchPopupViewModel {
  constructor(public parentVm: SearchViewModel) {
    makeAutoObservable(this);
  }

  visible = false;
  selected: number | null = null;
  searchedTags = new Set<string>();

  onArrowDown() {
    if (this.selected === null) {
      this.selected = 0;
    } else {
      this.selected = (this.selected + 1) % this.searchedTags.size;
    }
  }

  onArrowUp() {
    if (this.selected === null) {
      this.selected = this.searchedTags.size - 1;
    } else {
      this.selected = (this.selected - 1 + this.searchedTags.size) % this.searchedTags.size;
    }
  }

  onEnter() {
    if (this.selected !== null) {
      const tag = Array.from(this.searchedTags)[this.selected];
      if (!this.parentVm.selectedTags.has(tag)) {
        this.parentVm.addTag(Array.from(this.searchedTags)[this.selected]);
        this.hide();
      }
    }
  }

  onTagClick(tag: string) {
    if (this.parentVm.selectedTags.has(tag)) {
      return;
    }

    this.parentVm.addTag(tag);
    this.hide();
  }

  hide() {
    this.visible = false;
    this.selected = null;
  }

  tagsLeft = 0;
}
