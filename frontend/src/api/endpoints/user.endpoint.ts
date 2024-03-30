import { UserDto } from "../models/user.model";

export namespace UserEndpoint {
  export const current = () => ({}) as UserDto.Item;
}
