import { ImageDto } from "../models/image.model";
import api from "../utils/api";

export namespace ImagesEndpoint {
  // export const runQuery = async (v: {
  //   text: string;
  //   tags: string[];
  //   orientation_filter: string[];
  //   extension_filter: string[];
  // }) => {};

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
