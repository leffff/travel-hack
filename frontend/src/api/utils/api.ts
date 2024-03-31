import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getStoredAuthToken, removeStoredAuthToken } from "./authToken";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const get = <T>(path: string, config?: AxiosRequestConfig<unknown>): Promise<T> =>
  new Promise((resolve, reject) => {
    axios
      .get(path, {
        headers: {
          Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
          "Access-Control-Allow-Origin": "*"
        },
        ...config
      })
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            removeStoredAuthToken();
          }
          reject(error.response.data);
        } else {
          reject(error);
        }
      });
  });

const post = <T>(
  path: string,
  variables?: unknown,
  config?: AxiosRequestConfig<unknown>
): Promise<T> =>
  new Promise((resolve, reject) => {
    axios
      .post(path, variables, {
        ...config,
        headers: {
          Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
          "Access-Control-Allow-Origin": "*",
          ...config?.headers
        }
      })
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            removeStoredAuthToken();
            if (window?.location) {
              window.location.replace("/login");
            }
          }
          reject(error.response.data);
        } else {
          reject(error);
        }
      });
  });

const put = <T>(
  path: string,
  variables?: unknown,
  config?: AxiosRequestConfig<unknown>
): Promise<T> =>
  new Promise((resolve, reject) => {
    axios
      .put(path, variables, {
        headers: {
          Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
          "Access-Control-Allow-Origin": "*"
        },
        ...config
      })
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            removeStoredAuthToken();
            if (window?.location) {
              window.location.replace("/login");
            }
          }
          reject(error.response.data);
        } else {
          reject(error);
        }
      });
  });

const del = <T>(path: string, config?: AxiosRequestConfig<unknown>): Promise<T> =>
  new Promise((resolve, reject) => {
    axios
      .delete(path, {
        headers: {
          Authorization: getStoredAuthToken() ? `Bearer ${getStoredAuthToken()}` : undefined,
          "Access-Control-Allow-Origin": "*"
        },
        ...config
      })
      .then((response: AxiosResponse) => resolve(response.data))
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            removeStoredAuthToken();
            if (window?.location) {
              window.location.replace("/login");
            }
          }
          reject(error.response.data);
        } else {
          reject(error);
        }
      });
  });

export default {
  get,
  post,
  put,
  delete: del
};
