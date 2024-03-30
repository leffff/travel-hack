export namespace UserDto {
  export interface Result {
    access_token: string;
  }

  export interface Item {
    email: string;
    exp: number;
    role_id: number;
    user_id: number;
  }
}
