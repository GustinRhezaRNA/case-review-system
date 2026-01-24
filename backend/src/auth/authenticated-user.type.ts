export interface AuthenticatedUser {
  id: string;
  name: string;
  role: {
    id: number;
    name: string;
  };
}
