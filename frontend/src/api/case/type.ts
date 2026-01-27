export type Role = 'ADMIN' | 'SUPERVISOR' | 'AGENT';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedUser?: User;
  creator: User;
}
