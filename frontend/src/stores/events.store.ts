import { ImageDto, mockImages } from "@/api/models/image.model";
import { TravelGptViewModel } from "@/components/TravelGPT/travel-gpt.vm";
import { SearchViewModel } from "@/components/events/Search/serach.vm";
import { EventFiltersViewModel } from "@/components/events/filters/filters.vm";
import { downloadImage } from "@/lib/utils/download-image";
import { ImageGrid, groupImagesIntoGrids } from "@/lib/utils/group-image";
import { makeAutoObservable } from "mobx";

export class EventsViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  loading = false;

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

  relevantImages: ImageDto.Item[] = [];

  async openImage(image: ImageDto.Item) {
    this.expandedImage = image;
    this.relevantImages = [];
    this.relevantImages = this.images.filter((i) => i.id !== image.id);
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
    this.selectedImages.forEach((image) => downloadImage(image.imgSrc));
    this.selectedImages = new Set();
  }

  async onSearch() {
    this.loading = true;
    const filters = this.filtersVm.getFilters();
    const search = this.searchVm.getSearch();

    console.log(search, filters);
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  travelGptVm = new TravelGptViewModel(this);
  searchVm = new SearchViewModel(this);
  filtersVm = new EventFiltersViewModel();
}
