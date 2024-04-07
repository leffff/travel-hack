import { ImagesEndpoint } from "@/api/endpoints/image.endpoint";
import { ImageDto, mockImages } from "@/api/models/image.model";
import { TravelGptViewModel } from "@/components/TravelGPT/travel-gpt.vm";
import { SearchViewModel } from "@/components/events/Search/serach.vm";
import { EventFiltersViewModel } from "@/components/events/filters/filters.vm";
import { downloadImage, getFileFromUrl } from "@/lib/utils/download-image";
import { ImageGrid, groupImagesIntoGrids } from "@/lib/utils/group-image";
import { makeAutoObservable } from "mobx";

export class EventsViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  loading = false;

  public images: ImageDto.Item[] = mockImages;
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
    const imageFile = await getFileFromUrl(image.imgSrc);
    if (!imageFile) return;

    console.log("searching by image", imageFile.size);
    const res = await ImagesEndpoint.searchByImage(imageFile);
    this.relevantImages = res;
  }

  toggleImage(image: ImageDto.Item) {
    if (this.selectedImages.has(image)) {
      this.selectedImages.delete(image);
      return;
    }
    this.selectedImages.add(image);
  }

  async downloadSelectedImages() {
    await Promise.all([...this.selectedImages].map((image) => downloadImage(image.imgSrc)));
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

  rateUsWasShown = false;

  travelGptVm = new TravelGptViewModel(this);
  searchVm = new SearchViewModel(this);
  filtersVm = new EventFiltersViewModel();
}
