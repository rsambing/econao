export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthError {
  message: string;
}
