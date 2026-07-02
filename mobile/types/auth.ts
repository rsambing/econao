export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface AuthError {
  message: string;
}
