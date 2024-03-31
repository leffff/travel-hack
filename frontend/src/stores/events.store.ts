import { ImageDto, mockImages } from "@/api/models/image.model";
import { SearchViewModel } from "@/components/events/Search/serach.vm";
import { EventFiltersViewModel } from "@/components/events/filters/filters.vm";
import { ImageGrid, groupImagesIntoGrids } from "@/lib/utils/group-image";
import { makeAutoObservable } from "mobx";

export class EventsViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  private images: ImageDto.Item[] = mockImages;
  get groupedImages(): ImageGrid[] {
    return groupImagesIntoGrids(this.images);
  }

  expandedImage: ImageDto.Item | null = null;
  selectedImages: Set<ImageDto.Item> = new Set([]);
  get selectedImagesSize() {
    return [...this.selectedImages].reduce((acc, v) => {
      return acc + v.fileSize;
    }, 0);
  }

  openImage(image: ImageDto.Item) {
    this.expandedImage = image;
  }

  toggleImage(image: ImageDto.Item) {
    if (this.selectedImages.has(image)) {
      this.selectedImages.delete(image);
      return;
    }
    this.selectedImages.add(image);
  }

  downloadSelectedImages() {
    console.log("download selected images", this.selectedImages);
    this.selectedImages = new Set();
  }

  searchVm = new SearchViewModel(this);
  filtersVm = new EventFiltersViewModel();
}
