export namespace ImageDto {
  export interface Item {
    id: string;
    title: string;
    tags: string[];
    extension: string;
    fileSize: number; // bytes
    resolution: [number, number];
    imgSrc: string;
    location: [number, number];
  }
}

export const mockImages: ImageDto.Item[] = [
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/sunset-beach.jpg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/city-night.jpg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/mountain-hike.jpg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/autumn-forest.jpg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  },
  {
    id: "5",
    title: "Snowy Mountain Peak",
    tags: ["snow", "mountain", "peak"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/snowy-mountain.jpg",
    location: [45.8288, -110.5795],
    fileSize: 1023
  },
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/sunset-beach.jpg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/city-night.jpg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/mountain-hike.jpg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/autumn-forest.jpg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  },
  {
    id: "5",
    title: "Snowy Mountain Peak",
    tags: ["snow", "mountain", "peak"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/snowy-mountain.jpg",
    location: [45.8288, -110.5795],
    fileSize: 1023
  },
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/sunset-beach.jpg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/city-night.jpg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/mountain-hike.jpg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/autumn-forest.jpg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  },
  {
    id: "5",
    title: "Snowy Mountain Peak",
    tags: ["snow", "mountain", "peak"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/snowy-mountain.jpg",
    location: [45.8288, -110.5795],
    fileSize: 1023
  },
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/sunset-beach.jpg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/city-night.jpg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/mountain-hike.jpg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc: "https://example.com/img/autumn-forest.jpg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  }
];
