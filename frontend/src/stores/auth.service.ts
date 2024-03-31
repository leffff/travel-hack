import { AuthEndpoint } from "@/api/endpoints/auth.endpoint";
import { UserEndpoint } from "@/api/endpoints/user.endpoint";
import { UserDto } from "@/api/models/user.model";
import { removeStoredAuthToken } from "@/api/utils/authToken";
import { makeAutoObservable } from "mobx";

type Auth =
  | {
      state: "loading" | "anonymous";
    }
  | {
      state: "authenticated";
      user: UserDto.Item;
    };

class AuthServiceViewModel {
  public auth: Auth = { state: "loading" };

  constructor() {
    makeAutoObservable(this);
    void this.init();
  }

  private async init() {
    try {
      const user = await UserEndpoint.current();
      this.auth = { state: "authenticated", user };
    } catch {
      this.auth = { state: "anonymous" };
    }
  }

  login = async (username: string, password: string): Promise<boolean> => {
    try {
      await AuthEndpoint.login(username, password);

      const user = await UserEndpoint.current();
      this.auth = { state: "authenticated", user };
      return true;
    } catch {
      return false;
    }
  };

  loginViaVk = async (code: unknown): Promise<boolean> => {
    try {
      await AuthEndpoint.loginViaVk(code);

      const user = await UserEndpoint.current();
      this.auth = { state: "authenticated", user };
      return true;
    } catch {
      return false;
    }
  };

  register = async (username: string, password: string): Promise<boolean> => {
    try {
      await AuthEndpoint.register(username, password);

      const user = await UserEndpoint.current();
      this.auth = { state: "authenticated", user };
      return true;
    } catch {
      return false;
    }
  };

  logout() {
    this.auth = { state: "anonymous" };
    removeStoredAuthToken();
  }
}

export const AuthService = new AuthServiceViewModel();
