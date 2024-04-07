import { TagsDto } from "../models/tags.model";
import api from "../utils/api";

export namespace TagsEndpoint {
  export const searchByName = async (query: string, count = 15): Promise<TagsDto.Item> => {
    return api.get("/api/photobank/photos/tags/", {
      params: {
        query,
        count
      }
    });
  };
}
