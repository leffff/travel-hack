import { ImageDto } from "../models/image.model";
import api from "../utils/api";

export namespace ImagesEndpoint {
  export const runQuery = async (v: {
    text?: string;
    tags?: string[];
    orientation_filter?: string;
    extension_filter?: string;
    season_filter?: string;
    daytime_filter?: string;
  }): Promise<ImageDto.Item[]> => {
    /*
- text
- tags
- orientation_filter
- extension_filter
- daytime_filter
- season_filter
    */
    const generateQuery = () => {
      const query = new URLSearchParams();
      if (v.text) {
        query.append("text", v.text);
      } else {
        query.append("text", " ");
      }
      if (v.tags && v.tags.length > 0) {
        query.append("tags", v.tags.join(","));
      }
      if (v.orientation_filter) {
        query.append("orientation_filter", v.orientation_filter);
      }
      if (v.extension_filter) {
        query.append("extension_filter", v.extension_filter);
      }
      if (v.season_filter) {
        query.append("season_filter", v.season_filter);
      }
      if (v.daytime_filter) {
        query.append("daytime_filter", v.daytime_filter);
      }
      return query;
    };

    const res = await api.get<ImageDto.Result[]>(`/api/photobank/photos/query/?${generateQuery()}`);

    return res.map(ImageDto.convertDto);
  };

  export const searchByImage = async (file: File): Promise<ImageDto.Item[]> => {
    console.log(file);
    // const res = await api.post<ImageDto.Result>("/api/photobank/photos/picture/", {
    //   file
    // });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "https://d34f-176-100-240-67.ngrok-free.app/api/photobank/photos/picture/",
      {
        body: formData,
        method: "POST"
      }
    );

    const data = (await res.json()) as ImageDto.Result[];

    return data.map(ImageDto.convertDto);
  };
}
