export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
