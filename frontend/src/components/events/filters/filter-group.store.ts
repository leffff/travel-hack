import { makeAutoObservable } from "mobx";

export class FilterGroupViewModel<T extends string> {
  constructor(
    public readonly name: string,
    public readonly tags: T[]
  ) {
    makeAutoObservable(this);
  }

  selectedTags = new Set<T>();

  getSelectedTags() {
    return Array.from(this.selectedTags);
  }
}
