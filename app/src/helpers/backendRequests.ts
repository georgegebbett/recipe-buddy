import axios, { AxiosRequestConfig } from "axios";

function requestConfig(accessToken: string | undefined): AxiosRequestConfig {
  if (!accessToken) return {};

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

// const backendBaseUrl: string = import.meta.env.VITE_BACKEND_BASE_URL;
// const backendBaseUrl: string = "http://localhost:4000";
const backendBaseUrl: string = "/api";

export async function get(slug: string, accessToken: string | undefined) {
  const url = backendBaseUrl + slug;
  return axios.get(url, requestConfig(accessToken));
}

export async function post(
  slug: string,
  data: object,
  accessToken: string | undefined
) {
  const url = backendBaseUrl + slug;
  return axios.post(url, data, requestConfig(accessToken));
}

export async function put(
  slug: string,
  data: object,
  accessToken: string | undefined
) {
  const url = backendBaseUrl + slug;
  return axios.put(url, data, requestConfig(accessToken));
}
