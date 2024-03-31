import { ImageDto } from "@/api/models/image.model";

export interface ImageGrid {
  grid: number; // 1 - 5x, 2 - 2x, 3 - 3x, 4 - 5x
  images: ImageDto.Item[];
}

export const groupImagesIntoGrids = (images: ImageDto.Item[]): ImageGrid[] => {
  const layoutPatterns = [5, 2, 3, 5]; // Image count for each grid layout
  const imageGrids: ImageGrid[] = [];
  let currentPatternIndex = 0; // Tracks the current layout pattern
  let imageIndex = 0; // Tracks the current index in the images array

  while (imageIndex < images.length) {
    const gridCount = layoutPatterns[currentPatternIndex];
    const grid: ImageGrid = {
      grid: currentPatternIndex + 1, // Adjusting index to match grid numbering (1-4)
      images: []
    };

    // Add images to the current grid until it reaches the grid count or there are no more images
    for (let i = 0; i < gridCount && imageIndex < images.length; i++) {
      grid.images.push(images[imageIndex++]);
    }

    imageGrids.push(grid);

    // Move to the next layout pattern, wrapping back to the first pattern if necessary
    currentPatternIndex = (currentPatternIndex + 1) % layoutPatterns.length;
  }

  console.log(imageGrids);
  return imageGrids;
};
