import { AuthDto } from "api/models/auth.model";
import api from "api/utils/api";
import { setStoredAuthToken } from "api/utils/authToken";
import { parseJwt } from "api/utils/parseJwt";

export namespace AuthEndpoint {
  export const login = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const result = await api.post<AuthDto.Result>("/api/auth/login", params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    setStoredAuthToken(result.access_token);
    return parseJwt<AuthDto.Item>(result.access_token);
  };

  export const loginViaVk = async (code: unknown) => {
    // @ts-expect-error no spread but i know what im doing shut up
    const result = await api.post<AuthDto.Result>("/api/auth/login/vk", { ...code });

    setStoredAuthToken(result.access_token);
    return parseJwt<AuthDto.Item>(result.access_token);
  };

  export const register = async (email: string, password: string) => {
    const result = await api.post<AuthDto.Result>(
      "/api/auth/register",
      {
        email,
        password
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    setStoredAuthToken(result.access_token);
    return parseJwt<AuthDto.Item>(result.access_token);
  };
}
