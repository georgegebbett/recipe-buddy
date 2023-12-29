import {env} from "~/env";

const headers = {
  "GROCY-API-KEY": env.GROCY_API_KEY
}

export const grocyFetch = (suffix: string, init?: RequestInit) => fetch(`${env.GROCY_API_URL}${suffix}`, {
  ...init,
  headers: {
    ...init?.headers,
    ...headers
  }
})
