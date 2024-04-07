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

  export interface Result {
    id: number;
    title: string;
    width: number;
    height: number;
    created_at: string;
    status: string;
    file: string;
    file_size: number;
    rendition_url?: string;
  }

  export const convertDto = (dto: Result): Item => {
    return {
      id: dto.id.toString(),
      title: dto.title,
      tags: [],
      extension: "jpg",
      fileSize: dto.file_size,
      resolution: [dto.width, dto.height],
      imgSrc: dto.rendition_url ?? dto.file,
      location: [0, 0]
    };
  };
}

export namespace ImageFilters {
  export enum TimeOfYear {
    "Зима" = "Зима",
    "Весна" = "Весна",
    "Лето" = "Лето",
    "Осень" = "Осень"
  }

  export enum TimeOfDay {
    "Утро" = "Утро",
    "День" = "День",
    "Вечер" = "Вечер",
    "Ночь" = "Ночь"
  }

  export enum ScreenOrientation {
    "Горизонтальная" = "Горизонтальная",
    "Вертикальная" = "Вертикальная",
    "Квадратная" = "Квадратная"
  }

  export enum Format {
    "JPG" = "JPG",
    "PNG" = "PNG",
    "WEBP" = "WEBP"
  }
}

export const mockImages: ImageDto.Item[] = [
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  },
  {
    id: "5",
    title: "Snowy Mountain Peak",
    tags: ["snow", "mountain", "peak"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [45.8288, -110.5795],
    fileSize: 1023
  },
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  },
  {
    id: "5",
    title: "Snowy Mountain Peak",
    tags: ["snow", "mountain", "peak"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [45.8288, -110.5795],
    fileSize: 1023
  },
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  },
  {
    id: "5",
    title: "Snowy Mountain Peak",
    tags: ["snow", "mountain", "peak"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [45.8288, -110.5795],
    fileSize: 1023
  },
  {
    id: "1",
    title: "Sunset at the Beach",
    tags: ["sunset", "beach", "nature"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [34.0195, -118.4912],
    fileSize: 1023
  },
  {
    id: "2",
    title: "City Night Lights",
    tags: ["city", "night", "lights"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [40.7128, -74.006],
    fileSize: 1023
  },
  {
    id: "3",
    title: "Mountain Hike",
    tags: ["mountain", "hike", "adventure"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [39.7392, -104.9903],
    fileSize: 1023
  },
  {
    id: "4",
    title: "Autumn Forest Path",
    tags: ["autumn", "forest", "path"],
    extension: "jpg",
    resolution: [1920, 1080],
    imgSrc:
      "https://mimer.ru/content/ckfinder/userfiles/images/%D0%BC%D0%B0%D0%BB%D0%B5%D0%BD%D1%8C%D0%BA%D0%B0%D1%8F.jpeg",
    location: [48.8566, 2.3522],
    fileSize: 1023
  }
];
