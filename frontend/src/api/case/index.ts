import type {
  TCaseListResponse,
  TCaseDetailResponse,
  TCreateCaseRequest,
  TStatusCountsResponse,
  TAssignableUserResponse,
  TUserStatsResponse,
  TFilterCase,
} from "./type";

//for development non jwt only
import { api } from "../client";

//for production jwt only
// export { api } from "@/libs/axios/api";

const BASE_URL = "/api/v1/cases";

export const getCases = async (
  params: TFilterCase,
): Promise<TCaseListResponse> => {
  const response = await api.get<TCaseListResponse>(BASE_URL, { params });
  return response.data;
};

export const getCaseDetail = async (
  id: string,
): Promise<TCaseDetailResponse> => {
  const response = await api.get<TCaseDetailResponse>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCase = async (
  data: TCreateCaseRequest,
): Promise<TCaseDetailResponse> => {
  const response = await api.post<TCaseDetailResponse>(BASE_URL, data);
  return response.data;
};

export const assignCase = async (
  id: string,
  userId: string,
): Promise<TCaseDetailResponse> => {
  const response = await api.patch<TCaseDetailResponse>(
    `${BASE_URL}/${id}/assign`,
    { userId },
  );
  return response.data;
};

export const updateCaseStatus = async (
  id: string,
  status: string,
): Promise<TCaseDetailResponse> => {
  const response = await api.patch<TCaseDetailResponse>(
    `${BASE_URL}/${id}/status`,
    { status },
  );
  return response.data;
};

export const getStatusCounts = async (): Promise<TStatusCountsResponse> => {
  const response = await api.get<TStatusCountsResponse>(
    `${BASE_URL}/status-counts`,
  );
  return response.data;
};

export const getAssignableUsers = async (): Promise<TAssignableUserResponse> => {
  const response = await api.get<TAssignableUserResponse>(
    `${BASE_URL}/users`,
  );
  return response.data;
};

export const getUserStats = async (
  userId: string,
): Promise<TUserStatsResponse> => {
  const response = await api.get<TUserStatsResponse>(
    `${BASE_URL}/stats/${userId}`,
  );
  return response.data;
};
