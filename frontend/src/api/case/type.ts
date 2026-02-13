/* ===== ENUM ===== */
export const UserRole = {
  ADMIN: "ADMIN",
  SUPERVISOR: "SUPERVISOR",
  AGENT: "AGENT",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/* ===== BASIC TYPES ===== */
export type TRole = {
  id: string;
  name: UserRole;
};

export type TUserSimple = {
  id: string;
  name: string;
  role: TRole;
};

export type TCaseStatus = {
  id: string;
  name: string;
};

/* ===== CASE ===== */
export type TCase = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  createdBy: string;
  assignedTo: string | null;
  assignedBy: string | null;
  statusId: string;

  creator: TUserSimple;
  assignedUser: TUserSimple | null;
  assigner: TUserSimple | null;
  status: TCaseStatus;
};

/* ===== PAGINATION ===== */
export type TPaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type TPaginatedResponse<T> = {
  data: T[];
  meta: TPaginationMeta;
};

/* ===== FILTER ===== */
export type TFilterCase = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
};

/* ===== REQUEST ===== */
export type TCreateCaseRequest = {
  title: string;
  description: string;
};

/* ===== RESPONSES ===== */
export type TCaseListResponse = TPaginatedResponse<TCase>;

export type TCaseDetailResponse = TCase;

/* ===== STATUS COUNTS ===== */
export type TStatusCountItem = {
  status: string;
  count: number;
};

export type TStatusCountsResponse = {
  total: number;
  byStatus: TStatusCountItem[];
};

/* ===== USER STATS ===== */
export type TUserStatsItem = {
  status: string;
  count: number;
};

export type TUserStatsResponse = {
  userId: string;
  userName: string;
  totalAssigned: number;
  byStatus: TUserStatsItem[];
};

/* ===== ASSIGNABLE USERS ===== */
export type TAssignableUser = {
  id: string;
  name: string;
  role: {
    id: string;
    name: UserRole;
  };
};

export type TAssignableUserResponse = TAssignableUser[];
