import type { AxiosRequestConfig } from "axios";
import { env } from "../env";
export const axiosConfig: AxiosRequestConfig = {
    baseURL: env.VITE_API_BASE_URL,
};
